(function () {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmCuponsAddCtrl', AdmCuponsAddCtrl);

    /** @ngInject */
    function AdmCuponsAddCtrl($http, $mdDialog, $filter, $mdSidenav, $scope, $state, toast) {
        var vm = this;

        // Vars
        vm.customizations = getCustomizations();
        vm.items = getItems();
        vm.tagsList = getTagsList();
        vm.searchText = "";


        vm.types = [{
            short: "$",
            name: "Valor (R$)"
        }, {
            short: "%",
            name: "Percentual (%)"
        }];

        if(vm.edit){
            if (!vm.edit.tags) {
                vm.edit.tags = []
            }
        }

        vm.form = vm.edit || {
            tags: [],
            code: Random.id([8]),
            discountType: '$'
        };
        vm.progressLoading = false;
        vm.now = new Date();

        // // Methods
        vm.cancel = cancel;
        vm.save = save;
        vm.querySearch = querySearch;


        //Functions
        function getItems() {
            Meteor.call("getAllItems", function (err, r) {
                err ? toast.message(err.reason) : (vm.items = r.items);
            });
        }

        //busca a lista de tags
        function getTagsList() {
            Meteor.call("tagsList", function (err, r) {
                err ? toast.message(err.reason) : (vm.tagsList = r);
                tagsConfig();
            });
        }

        function tagsConfig() {
            const newTags = [];
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

        //realiza a query de busca para um determinado md-chips
        function querySearch(query, local) {
            console.log(vm);
            console.log(local);
            // console.log(filter);
            console.log(vm[local].filter);
            if (local === "items" && vm.form.related.length >= 5) {
                toast.message("Máximo de 5 itens relacionados.");
            } else {
                return query
                    ? vm[local].filter(createFilterFor(query, local))
                    : [];
            }
        }

        function getCustomizations() {
            Meteor.call("listCustomizations", function (err, r) {
                err ? toast.message(err.reason) : (vm.customizations = r);
            });
        }

        function createFilterFor(query, local) {
            const lowercaseQuery = Diacritics.remove(angular.lowercase(query));

            return function filterFn(variable) {
                return angular
                    .lowercase(
                        local === "tagsList" || local === "items"
                            ? variable.name
                            : variable.type
                    )
                    .match(lowercaseQuery);
            };
        }

        function cancel() {
            if (!vm.progressLoading && !vm.needSave)
                $mdDialog.cancel();
        }

        function save() {
            vm.progressLoading = true;
            if (vm.form.discountType === '%')
                if (vm.form.discount < 0 || vm.form.discount > 100) {
                    toast.message("O percentual não pode ser fora do intervalo 0-100");
                    vm.progressLoading = false;
                    return;
                }
            const method = (vm.edit) ? 'cupomEdit' : 'cupomAdd';
            const message = (vm.edit) ? 'Cupom editado com sucesso' : 'Cupom inserido com sucesso';
            Meteor.call(method, angular.copy(vm.form), function (err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.form = {};
                    vm.progressLoading = false;
                    $mdDialog.hide(message);
                }
            });
        }

    }

})();
