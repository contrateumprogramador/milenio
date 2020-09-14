(function() {
    "use strict";

    angular.module("fuseapp").controller("StoreBannersCtrl", StoreBannersCtrl);

    /** @ngInject */
    function StoreBannersCtrl(
        $mdDialog,
        $mdSidenav,
        $scope,
        $state,
        $reactive,
        $rootScope,
        toast,
        CompanyBanners
    ) {
        var vm = this;

        // Data
        vm.form = {};
        vm.companyBanners = CompanyBanners || {};
        vm.displaying = {};

        // Vars
        vm.dragControlListeners = {
            accept: function(sourceItemHandleScope, destSortableScope) {
                return (
                    sourceItemHandleScope.itemScope.sortableScope.$id ===
                    destSortableScope.$id
                );
            }, //override to determine drag is allowed or not. default is true.
            itemMoved: function(event) {
                var moveSuccess, moveFailure;
                moveFailure = function() {
                    eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                    eventObj.source.itemScope.sortableScope.insertItem(
                        eventObj.source.index,
                        eventObj.source.itemScope.task
                    );
                };
            },
            orderChanged: function(event) {
                reorder(event);
            },
            containment: "#cardView",
            clone: false, //optional param for clone feature.
            allowDuplicates: false, //optional param allows duplicates to be dropped.
            additionalPlaceholderClass: "placeholder-drag"
        };

        // Methods
        vm.addButton = add;
        vm.edit = edit;
        vm.getList = getList;
        vm.openForm = openForm;
        vm.remove = remove;
        vm.removeGroup = removeGroup;
        vm.select = select;
        vm.show = show;
        vm.toggleDetails = toggleDetails;

        //////////

        function add(ev) {
            openForm("addBanner", ev);
        }

        function edit(ev, banner, group, key) {
            vm.selected = banner;
            vm.group = group;
            vm.key = key;
            openForm("editBanner", ev);
        }

        function getList() {
            Meteor.call("bannersList", function(err, r) {
                err ? toast.message(err.reason) : (vm.companyBanners = r);
            });
        }

        function openForm(action, ev, edit) {
            var controller, templateUrl, locals;

            switch (action) {
                case "addBanner":
                case "editBanner":
                    controller = "StoreBannersAddCtrl as vm";
                    templateUrl =
                        "client/app/store/banners/store.banners-add.view.ng.html";
                    locals =
                        action == "editBanner"
                            ? {
                                  edit: angular.copy(vm.selected),
                                  bannersGroup: vm.companyBanners,
                                  group: vm.group,
                                  key: vm.key
                              }
                            : { bannersGroup: vm.companyBanners };
                    break;
            }

            $mdDialog
                .show({
                    controller: controller,
                    templateUrl: templateUrl,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    locals: locals,
                    bindToController: true
                })
                .then(function(answer) {
                    getList();
                    toast.message(answer);
                });
        }

        function remove(ev, banner, group, key) {
            var confirm = $mdDialog
                .confirm()
                .title("Exclusão")
                .textContent("Deseja excluir o banner " + banner.title + "?")
                .ariaLabel("Exclusão")
                .targetEvent(ev)
                .ok("Excluir")
                .cancel("Cancelar");
            removePicture(banner, confirm, group, key);
        }

        function imgUrl(url, remove) {
            const imagesUrl = "https://imagens.mileniomoveis.com.br";

            if (remove) return url.replace(imagesUrl, "");

            return url.replace(
                "https://s3-sa-east-1.amazonaws.com/mileniomoveis",
                imagesUrl
            );
        }

        function removePicture(banner, confirm, group, key) {
            $mdDialog.show(confirm).then(function() {
                $rootScope.loadingProgress = true;
                S3.delete(imgUrl(banner.url), function(err, r) {
                    if (err) {
                        toast.message(err);
                    } else {
                        Meteor.call(
                            "bannerRemove",
                            banner,
                            group,
                            key,
                            function(err, r) {
                                $rootScope.loadingProgress = false;
                                if (err) toast.message(err.reason);
                                else {
                                    toast.message("Banner excluído.");
                                    getList();
                                }
                            }
                        );
                    }
                });
            });
        }

        function removeGroup(ev, group) {
            var confirm = $mdDialog
                .confirm()
                .title("Exclusão")
                .textContent("Deseja excluir o grupo " + group.group + "?")
                .ariaLabel("Exclusão")
                .targetEvent(ev)
                .ok("Excluir")
                .cancel("Cancelar");

            $mdDialog.show(confirm).then(function() {
                $rootScope.loadingProgress = true;
                Meteor.call("groupBannersRemove", group, function(err, r) {
                    $rootScope.loadingProgress = false;
                    if (err) toast.message(err.reason);
                    else {
                        toast.message("Grupo excluído.");
                        getList();
                    }
                });
            });
        }

        function reorder(banner) {
            var groupName = "";
            vm.companyBanners.forEach(function(group) {
                group.banners.forEach(function(arrayBanner) {
                    if (
                        JSON.stringify(arrayBanner) ==
                        JSON.stringify(banner.source.itemScope.banner)
                    ) {
                        groupName = group.group;
                    }
                });
            });
            Meteor.call(
                "bannerReorder",
                angular.copy(vm.companyBanners),
                groupName,
                function(err, r) {
                    vm.loadingProgress = false;
                    if (err) toast.message(err.reason);
                    else {
                        toast.message("Lista reordenada.");
                        $scope.$apply();
                    }
                }
            );
        }

        /**
         * Select an item
         *
         * @param item
         */
        function select(item) {
            vm.selected = item;
        }

        function show(show, key, group) {
            vm.displaying[group] = !vm.displaying[group]
                ? {}
                : vm.displaying[group];
            vm.displaying[group][key] = show ? 1 : 0;
        }

        /**
         * Toggle details
         *
         * @param item
         */
        function toggleDetails(item) {
            vm.selected = item;
            toggleSidenav("details-sidenav");
        }
    }
})();
