(function() {
    "use strict";

    angular
        .module("fuseapp")
        .controller(
            "AdmItemsAddCustomizationCtrl",
            AdmItemsAddCustomizationCtrl
        );

    /** @ngInject */
    function AdmItemsAddCustomizationCtrl(
        $http,
        $mdDialog,
        $mdSidenav,
        $mdToast,
        $scope,
        $state,
        toast
    ) {
        var vm = this;

        // Vars
        vm.imageView = vm.tab;

        // //  Dropzone Options
        vm.dropzoneOptions = {
            uploadMultiple: false,
            dictDefaultMessage:
                "<i class='icon-cloud-upload'></i><br>Clique ou arraste para enviar uma imagem",
            accept: (file, done) => {
                initFileUpload(file);
            }
        };

        if (vm.edit) vm.edit.active = vm.edit.active ? true : false;

        vm.form = vm.edit || {
            type: "",
            options: [
                {
                    name: "",
                    image: "",
                    code: Date.now()
                }
            ]
        };

        vm.progressLoading = false;
        vm.selectedItem = null;
        vm.searchText = null;

        // // Methods
        vm.initFileUpload = initFileUpload;
        vm.cancel = cancel;
        vm.newItem = newItem;
        vm.removeItem = removeItem;
        vm.removePicture = removePicture;
        vm.save = save;
        vm.setIndex = setIndex;

        //Functions

        function cancel() {
            if (vm.needSave) {
                vm.form.pictures.forEach(function(picture) {
                    removePicture(picture);
                });
                $mdDialog.cancel();
            } else {
                $mdDialog.cancel();
            }
        }

        function newItem(type) {
            vm.form.options.push({
                name: "",
                image: "",
                code: Date.now()
            });
        }

        function removeItem(type, key, url) {
            if (url) removePicture(url, key);
            vm.form.options.splice(key, 1);
        }

        function imgUrl(url, remove) {
            const imagesUrl = "https://imagens.mileniomoveis.com.br";

            if (remove) return url.replace(imagesUrl, "");

            return url.replace(
                "https://s3-sa-east-1.amazonaws.com/mileniomoveis",
                imagesUrl
            );
        }

        function removePicture(url, key, onlyPicture) {
            S3.delete(imgUrl(url), function(err, r) {
                if (err) {
                    toast.message(err);
                } else {
                    toast.message("Imagem excluída");
                    if (onlyPicture) vm.form.options[key].image = "";
                }
            });
        }

        function save() {
            var method = vm.edit ? "customizationEdit" : "customizationAdd";
            var message = vm.edit
                ? "Customização editada com sucesso"
                : "Customização inserida com sucesso";
            Meteor.call(method, angular.copy(vm.form), function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.form = {};
                    vm.progressLoading = false;
                    $mdDialog.hide(message);
                }
            });
        }

        function setIndex(key) {
            vm.dropKey = key;
        }

        function initFileUpload(img) {
            S3.upload(
                {
                    file: img,
                    path: "customizacoes"
                },
                function(err, r) {
                    if (err) {
                        toast.message(err);
                    } else {
                        vm.needSave = true;
                        vm.form.options[vm.dropKey].image = imgUrl(
                            r.secure_url
                        );
                        $scope.$apply();
                    }
                }
            );
        }
    }
})();
