(function() {
    "use strict";

    angular
        .module("fuseapp")
        .controller("AdmAffiliatesCtrl", AdmAffiliatesCtrl);

    /** @ngInject */
    function AdmAffiliatesCtrl(
        $filter,
        $mdDialog,
        $mdSidenav,
        $scope,
        $state,
        $reactive,
        toast,
        List,
        $timeout
    ) {
        var vm = this;

        // Data
        vm.delayTimer = null;
        vm.form = {};
        vm.items = List.items || [];
        vm.total = List.total;
        vm.searchTerm = "";
        vm.selected = vm.items[0] || {};
        vm.pagination = {
            limit: 20,
            page: 1
        };
        vm.order = "-profile.comissions.total";

        // Methods
        vm.add = add;
        vm.edit = edit;
        vm.getList = getList;
        vm.openForm = openForm;
        vm.remove = remove;
        vm.select = select;
        vm.sort = sort;
        vm.search = search;
        vm.welcome = welcome;

        //////////
        function add(ev) {
            openForm("add", ev);
        }

        function edit(ev) {
            openForm("edit", ev);
        }

        function getList() {
            vm.progressLoading = true;

            const searchTerm = vm.searchTerm.toLowerCase().trim();

            const query = searchTerm.length
                ? {
                      $or: [
                          {
                              "profile.firstname": {
                                  $regex: `^${searchTerm}.*`,
                                  $options: "i"
                              }
                          },
                          {
                              "profile.lastname": {
                                  $regex: `^${searchTerm}.*`,
                                  $options: "i"
                              }
                          }
                      ]
                  }
                : {};

            const options = {
                skip: (vm.pagination.page - 1) * vm.pagination.limit,
                limit: vm.pagination.limit,
                sort: {
                    [vm.order]: vm.order.charAt(0) == "-" ? -1 : 1
                }
            };

            Meteor.call("Affiliate.list", query, options, function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.progressLoading = false;
                    vm.items = r.items;
                    vm.total = r.total;
                    vm.selected = vm.items[0] || {};
                    $scope.$apply();
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller, templateUrl, locals;

            switch (action) {
                case "add":
                case "edit":
                    controller = "AdmAffiliatesAddCtrl as vm";
                    templateUrl =
                        "client/app/adm/affiliates/adm.affiliates-add.view.ng.html";
                    locals =
                        action == "edit"
                            ? { edit: angular.copy(vm.selected) }
                            : {};
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

        function remove(ev) {
            var confirm = $mdDialog
                .confirm()
                .title("Exclusão")
                .textContent(
                    `Deseja excluir o decorador ${
                        vm.selected.profile.firstname
                    } ${vm.selected.profile.lastname}?`
                )
                .ariaLabel("Exclusão")
                .targetEvent(ev)
                .ok("Excluir")
                .cancel("Cancelar");

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;
                Meteor.call("Affiliate.remove", vm.selected._id, function(
                    err,
                    r
                ) {
                    vm.progressLoading = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message("Decorador excluído.");
                        getList();
                    }
                });
            });
        }

        function search() {
            getList();
        }

        function sort() {
            $timeout(getList, 10);
        }

        /**
         * Select an costumer
         *
         * @param costumer
         */
        function select(item) {
            vm.selected = item;
        }

        function welcome(ev) {
            var confirm = $mdDialog
                .confirm()
                .title("Boas vindas")
                .textContent(
                    `Deseja reenviar o e-mail de boas vindas para ${
                        vm.selected.profile.firstname
                    } ${vm.selected.profile.lastname}?`
                )
                .ariaLabel("Enviar")
                .targetEvent(ev)
                .ok("Enviar")
                .cancel("Cancelar");

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;
                Meteor.call("Affiliate.welcome", vm.selected._id, function(
                    err,
                    r
                ) {
                    vm.progressLoading = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message("E-mail de boas vindas enviado");
                    }
                });
            });
        }
    }
})();
