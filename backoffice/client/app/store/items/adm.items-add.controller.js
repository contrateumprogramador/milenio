(function () {
    "use strict";

    angular.module("fuseapp").controller("AdmItemsAddCtrl", AdmItemsAddCtrl);

    /** @ngInject */
    function AdmItemsAddCtrl(
        $http,
        $mdDialog,
        $mdSidenav,
        $filter,
        $rootScope,
        $scope,
        $state,
        toast
    ) {
        var vm = this;

        //Data
        vm.stockOptions = [
            {
                value: -1,
                name: "Indisponível"
            },
            {
                value: 0,
                name: "Sob Encomenda"
            },
            {
                value: 1,
                name: "Pronta Entrega"
            }
        ];

        Meteor.call("companyUser", (err, r) => (vm.company = err ? {} : r));

        // Vars
        vm.customizations = getCustomizations();
        vm.items = getItems();
        vm.tagsList = getTagsList();
        vm.imageView = vm.tab;
        vm.loading = false;
        vm.searchText = "";
        vm.google_categories = [];
        vm.exibedCategories = [];

        if (vm.edit) {
            googleConfig();
            if (vm.edit.installments) vm.installments = true;
        }

        vm.form = vm.edit || vm.previousProduct || {
            tags: [],
            pictures: [],
            active: true,
            options: [
                {
                    name: "",
                    price: "",
                    salesPrice: "",
                    sku: Date.now()
                }
            ],
            customizations: [],
            related: [],
            attributes: [],
            rank: 5,
            recurrence: []
        };

        if (!vm.form.recurrence) vm.form.recurrence = [];

        vm.recurrencePeriods = {
            1: "Semanal",
            2: "Quinzenal",
            3: "Mensal",
            4: "Bimestral",
            5: "Trimestral",
            6: "Semestral",
            7: "Anual"
        };

        getDescriptions();

        vm.progressLoading = false;
        vm.selectedItem = null;
        vm.searchText = null;

        // // Methods
        vm.calcRecurrenceTotal = calcRecurrenceTotal;
        vm.initFileUpload = initFileUpload;
        vm.cancel = cancel;
        vm.newPrice = newPrice;
        vm.removePrice = removePrice;
        vm.newRecurrence = newRecurrence;
        vm.removeRecurrence = removeRecurrence;
        vm.removePicture = removePicture;
        vm.save = save;
        vm.setUrl = setUrl;
        vm.searchGoogleCategory = searchGoogleCategory;
        vm.typingUrl = typingUrl;
        vm.querySearch = querySearch;

        //Functions
        function calcRecurrenceTotal(index) {
            const recurrence = vm.form.recurrence[index],
                discount = (recurrence.value * recurrence.discount) / 100;

            recurrence.total = recurrence.value - discount;

            vm.form.recurrence[index] = recurrence;
        }

        //fecha o md-dialog
        function cancel() {
            if (vm.needSave) {
                vm.form.pictures.forEach(function (picture) {
                    removePicture(picture);
                });
                $mdDialog.cancel();
            } else if (!vm.progressLoading) $mdDialog.cancel();
        }

        // configura a string de busca
        function configureString(search) {
            return search.toLowerCase().trim();
        }

        //regex para configuração da url digitada
        function configureUrl(type) {
            var title = vm.form[type].replace(/ /g, "-");
            title = Diacritics.remove(title);
            vm.form.options[0].name = vm.form.name;
            return title.replace(/[^a-z0-9-]/gi, "").toLowerCase();
        }

        // adiciona um novo subitem
        function newPrice() {
            vm.form.options.push({
                name: "",
                price: "",
                salesPrice: "",
                sku: Date.now()
            });
        }

        // remove um subitem
        function removePrice(key) {
            vm.form.options.splice(key, 1);
        }

        function newRecurrence() {
            vm.form.recurrence.push({
                periodicity: "",
                value: 0,
                discount: 0,
                total: 0
            });
        }

        function removeRecurrence(key) {
            vm.form.recurrence.splice(key, 1);
        }

        function getDescriptions() {
            Meteor.call("getSettings", function (err, r) {
                err
                    ? toast.message(err.reason)
                    : (vm.descriptions = r.descriptions);
                var tempFields = [],
                    newFields = [];

                tempFields = vm.form.attributes.map(function (desc) {
                    return desc.title;
                });

                vm.descriptions.forEach(function (description) {
                    if (tempFields.indexOf(description) > -1)
                        newFields.push(
                            vm.form.attributes[tempFields.indexOf(description)]
                        );
                    else {
                        newFields.push({
                            title: description,
                            content: ""
                        });
                    }
                });

                vm.form.attributes = newFields;
            });
        }

        function getItems() {
            Meteor.call("getAllItems", function (err, r) {
                err ? toast.message(err.reason) : (vm.items = r.items);
            });
        }

        function getCustomizations() {
            Meteor.call("listCustomizations", function (err, r) {
                err ? toast.message(err.reason) : (vm.customizations = r);
            });
        }

        //busca a lista de tags
        function getTagsList() {
            Meteor.call("tagsList", function (err, r) {
                err ? toast.message(err.reason) : (vm.tagsList = r);
                tagsConfig();
            });
        }

        function googleConfig() {
            vm.edit.active = vm.edit.active ? true : false;
            if (!vm.edit.googleShopping) {
                vm.edit.googleShopping = {
                    active: 0,
                    data: {}
                };
            } else {
                vm.edit.googleShopping.active = vm.edit.googleShopping.active
                    ? true
                    : false;

                try {
                    vm.edit.googleShopping.data =
                        JSON.parse(vm.edit.googleShopping.data) || {};

                    // enquanto for string, continua dando parse
                    while (typeof vm.edit.googleShopping.data == "string") {
                        vm.edit.googleShopping.data =
                            JSON.parse(vm.edit.googleShopping.data) || {};
                    }
                } catch (e) {
                    vm.edit.googleShopping.data = {};
                }
            }
        }

        function tagsConfig() {
            var newTags = [];
            vm.tagsList.forEach(function (group) {
                group.tags.forEach(function (tag) {
                    newTags.push({
                        name: tag.name,
                        url: tag.url,
                        tagsGroup: group.name
                    });
                });
            });
            vm.tagsList = newTags;
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
            S3.delete(imgUrl(url), function (err, r) {
                if (err) {
                    toast.message(err);
                } else {
                    toast.message("Imagem Excluída");
                    vm.needSave = true;
                    vm.form.pictures.splice(vm.form.pictures.indexOf(url), 1);
                }
            });
        }

        // salva o novo objeto
        function save() {
            vm.loading = true;
            var method = vm.edit ? "itemEdit" : "itemAdd";
            var message = vm.edit
                ? "Item editado com sucesso"
                : "Item inserido com sucesso";

            vm.form.name_nd = angular.lowercase(
                Diacritics.remove(vm.form.name)
            );

            const copy = angular.copy(vm.form)

            Meteor.call(method, copy, function (err, r) {
                vm.loading = false;
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.form = {};
                    vm.needSave = false;
                    if (!vm.edit) {
                        $mdDialog.hide({
                            message,
                            previousProduct: copy
                        });
                    } else {
                        $mdDialog.hide(message);
                    }
                }
            });
        }

        //seta a url no campo de url, gerado automaticamente
        function setUrl() {
            vm.form.url = vm.form.name ? configureUrl("name") : "";
        }

        //gera a url a medida que o usuário digita o nome do produto
        function typingUrl() {
            vm.form.url = configureUrl("url");
        }

        //inicia o upload do arquivo para a amazon
        function initFileUpload(img) {
            S3.upload(
                {
                    file: img,
                    path: "itens"
                },
                function (err, r) {
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

        function searchGoogleCategory(searchText) {
            if (searchText.length > 3) {
                vm.progressLoading = true;
                if (vm.google_categories.length == 0) {
                    Meteor.call(
                        "googleSearch",
                        configureString(searchText),
                        function (err, r) {
                            vm.google_categories = r;
                            vm.exibedCategories = r;
                            vm.progressLoading = false;
                        }
                    );
                } else {
                    vm.exibedCategories = $filter("filter")(
                        angular.copy(vm.google_categories),
                        configureString(searchText)
                    );
                    vm.progressLoading = false;
                }
            } else {
                vm.google_categories = [];
                vm.exibedCategories = [];
            }
        }

        function select(category) {
            vm.form.googleShopping.data["g:google_product_category"] = category;
        }

        //realiza a query de busca para um determinado md-chips
        function querySearch(query, local) {
            if (local === "items" && vm.form.related.length >= 5)
                toast.message("Máximo de 5 itens relacionados.");
            else {
                return query
                    ? vm[local].filter(createFilterFor(query, local))
                    : [];
            }
        }

        function createFilterFor(query, local) {
            var lowercaseQuery = Diacritics.remove(angular.lowercase(query));

            return function filterFn(variable) {
                return angular
                    .lowercase(
                        local == "tagsList" || local == "items"
                            ? variable.name
                            : variable.type
                    )
                    .match(lowercaseQuery);
            };
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
            accept: function (sourceItemHandleScope, destSortableScope) {
                return true;
            }, //override to determine drag is allowed or not. default is true.
            itemMoved: function (event) {
                console.log("moveu");
            },
            orderChanged: function (event) {
            },
            containment: "#board",
            clone: false, //optional param for clone feature.
            allowDuplicates: false, //optional param allows duplicates to be dropped.
            additionalPlaceholderClass: "placeholder-drag"
        };
    }
})();
