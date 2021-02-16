(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreEnvironmentsAddCtrl', StoreEnvironmentsAddCtrl);

    /** @ngInject */
    function StoreEnvironmentsAddCtrl($http, $mdDialog, $mdSidenav, $scope, $state, toast) {
        var vm = this;

        // Vars
        vm.form = vm.edit || {
            tags: [],
            pictures: [],
            active: true
        };
        vm.progressLoading = false;

        vm.tagsList = getTagsList();
        vm.searchText = ""

        // Methods
        vm.cancel = cancel;
        vm.save = save;
        vm.querySearch = querySearch;
        vm.setUrl = setUrl;
        vm.typingUrl = typingUrl;
        vm.removePicture = removePicture;
        vm.initFileUpload = initFileUpload;
        vm.select = select;

        //Functions
        function cancel(){
            if(!vm.progressLoading && !vm.needSave)
                $mdDialog.cancel();
        }

        function getTagsList() {
            Meteor.call("tagsList", function(err, r) {
                err ? toast.message(err.reason) : (vm.tagsList = r);
                tagsConfig();
            });
        }

        function tagsConfig() {
            var newTags = [];
            vm.tagsList.forEach(function(group) {
                group.tags.forEach(function(tag) {
                    newTags.push({
                        name: tag.name,
                        url: tag.url,
                        tagsGroup: group.name
                    });
                });
            });
            vm.tagsList = newTags;
        }

        //realiza a query de busca para um determinado md-chips
        function querySearch(query, local) {
            if (local == "items" && vm.form.related.length >= 5)
                toast.message("Máximo de 5 itens relacionados.");
            else {
                var results = query
                    ? vm[local].filter(createFilterFor(query, local))
                    : [];
                return results;
            }
        }

        function createFilterFor(query, local) {
            var lowercaseQuery = Diacritics.remove(angular.lowercase(query));

            return function filterFn(variable) {
                return angular
                    .lowercase(
                        local == "tagsList" ? variable.name : variable.profile.firstname + " " +variable.profile.lastname
                    )
                    .match(lowercaseQuery);
            };
        }

        //seta a url no campo de url, gerado automaticamente
        function setUrl() {
            vm.form.url = vm.form.name ? configureUrl("name") : "";
        }

        //gera a url a medida que o usuário digita o nome do produto
        function typingUrl() {
            vm.form.url = configureUrl("url");
        }

        //regex para configuração da url digitada
        function configureUrl(type) {
            var title = vm.form[type].replace(/ /g, "-");
            title = Diacritics.remove(title);
            return title.replace(/[^a-z0-9-]/gi, "").toLowerCase();
        }

        function imgUrl(url, remove) {
            const imagesUrl = "https://imagens.mileniomoveis.com.br";

            if (remove) return url.replace(imagesUrl, "");

            return url.replace(
                "https://s3-sa-east-1.amazonaws.com/mileniomoveis",
                imagesUrl
            );
        }

        //remove a imagem na amazon
        function removePicture(url) {
            S3.delete(imgUrl(url), function(err, r) {
                if (err) {
                    toast.message(err);
                } else {
                    toast.message("Imagem Excluída");
                    vm.needSave = true;
                    vm.form.pictures.splice(vm.form.pictures.indexOf(url), 1);
                }
            });
        }

        //inicia o upload do arquivo para a amazon
        function initFileUpload(img) {
            S3.upload(
                {
                    file: img,
                    path: "environments"
                },
                function(err, r) {
                    if (err) {
                        toast.message("Erro ao enviar imagem.");
                    } else {
                        vm.needSave = true;
                        vm.form.pictures.push(imgUrl(r.secure_url));
                        $scope.$apply();
                    }
                }
            );
        }

        // //  Dropzone Options
        vm.dropzoneOptions = {
            uploadMultiple: true,
            dictDefaultMessage:
                "<i class='icon-cloud-upload'></i><br>Clique ou arraste para enviar imagens",
            accept: (file, done) => {
                initFileUpload(file);
            }
        };

        //drag-and-drop options
        vm.dragControlListeners = {
            accept: function(sourceItemHandleScope, destSortableScope) {
                return true;
            }, //override to determine drag is allowed or not. default is true.
            itemMoved: function(event) {
                console.log("moveu");
            },
            orderChanged: function(event) {},
            containment: "#board",
            clone: false, //optional param for clone feature.
            allowDuplicates: false, //optional param allows duplicates to be dropped.
            additionalPlaceholderClass: "placeholder-drag"
        };     

        function save(){
            var method = (vm.edit) ? 'Environments.edit' : 'Environments.add';
            var message = (vm.edit) ? 'Ambiente editado com sucesso' : 'Ambiente inserido com sucesso';

            vm.form.name_nd = angular.lowercase(
                Diacritics.remove(vm.form.name)
            );

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

        function select(affiliate) {
            vm.form.affiliate = affiliate
            console.log(vm.form.affiliate)
        }
    }

})();
