(function() {
    "use strict";

    angular
        .module("fuseapp")
        .controller("StoreBannersAddCtrl", StoreBannersAddCtrl);

    /** @ngInject */
    function StoreBannersAddCtrl(
        $http,
        $mdDialog,
        $mdSidenav,
        $scope,
        $state,
        toast
    ) {
        var vm = this;

        // Vars
        vm.form = vm.edit || {};
        vm.groups = vm.bannersGroup;
        vm.progressLoading = false;

        // //  Dropzone Options
        vm.dropzoneOptions = {
            desktop: {
                dictDefaultMessage:
                    "<i class='icon-cloud-upload'></i><br>Clique ou arraste para enviar imagens",
                accept: (file, done) => {
                    initFileUpload(file, "url");
                }
            },
            mobile: {
                dictDefaultMessage:
                    "<i class='icon-cloud-upload'></i><br>Clique ou arraste para enviar imagens",
                accept: (file, done) => {
                    initFileUpload(file, "urlMobile");
                }
            }
        };
        vm.selectedItem = null;
        vm.searchText = vm.group || null;

        // // Methods
        vm.cancel = cancel;
        vm.save = save;
        vm.querySearch = querySearch;

        //Functions

        function cancel() {
            if (!vm.progressLoading && !vm.needSave) $mdDialog.cancel();
        }

        function imgUrl(url, remove) {
            const imagesUrl = "https://imagens.mileniomoveis.com.br";

            if (remove) return url.replace(imagesUrl, "");

            return url.replace(
                "https://s3-sa-east-1.amazonaws.com/mileniomoveis",
                imagesUrl
            );
        }

        function initFileUpload(img, property) {
            function upload() {
                S3.upload(
                    {
                        file: img,
                        path: "posters"
                    },
                    function(err, r) {
                        if (err) {
                            toast.message("Erro ao enviar imagem.");
                        } else {
                            vm.form[property] = imgUrl(r.secure_url);
                            console.log(vm.form[property]);
                            vm.progressLoading = false;
                            $scope.$apply();
                        }
                    }
                );
            }

            vm.progressLoading = true;
            $scope.$apply();
            if (vm.edit) {
                S3.delete(imgUrl(vm.form.url, true), function(err, r) {
                    if (err) {
                        toast.message("Erro ao excluir imagem antiga.");
                    } else {
                        upload();
                    }
                });
            } else {
                upload();
            }
        }

        function save() {
            var method = vm.edit ? "bannerEdit" : "bannerAdd";
            var message = vm.edit
                ? "Banner editado com sucesso"
                : "Banner inserido com sucesso";
            var group = vm.selectedItem ? vm.selectedItem.group : vm.searchText;
            var isNew = vm.selectedItem ? false : true;
            Meteor.call(
                method,
                angular.copy(vm.form),
                group,
                isNew,
                vm.key,
                function(err, r) {
                    if (err) {
                        toast.message(err.reason);
                    } else {
                        vm.form = {};
                        vm.progressLoading = false;
                        $mdDialog.hide(message);
                    }
                }
            );
        }

        function querySearch(query) {
            var results = query ? vm.groups.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = Diacritics.remove(angular.lowercase(query));

            return function filterFn(variable) {
                return angular.lowercase(variable.group).match(lowercaseQuery);
            };
        }
    }
})();
