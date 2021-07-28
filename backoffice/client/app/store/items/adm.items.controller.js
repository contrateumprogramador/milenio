(function () {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmItemsCtrl', AdmItemsCtrl);

    /** @ngInject */
    function AdmItemsCtrl($filter, $mdDialog, $mdSidenav, $scope, $state, $reactive, Customizations, Items, Tags, toast) {
        var vm = this;

        // Data
        vm.form = {};
        vm.customizations = Customizations;
        vm.selected = vm.customizations[0] || {};
        vm.items = Items.items;
        vm.tags = Tags;
        vm.role = Meteor.user().roles[0];

        // Vars
        vm.showToolbar = true;
        vm.total = Items.total;
        vm.pagination = {
            limit: 10,
            skip: 0,
            page: 1
        };
        vm.search = {
            name_nd: "",
            provider: ""
        };
        vm.selectedItem = null;
        vm.searchText = null;
        vm.loading = false;
        changePage();

        // Methods
        vm.add = add;
        vm.changePage = changePage;
        vm.edit = edit;
        vm.getList = getList;
        vm.getOneItem = getOneItem;
        vm.info = info;
        vm.openForm = openForm;
        vm.querySearch = querySearch;
        vm.remove = remove;
        vm.searchText = searchText;
        vm.searchTags = searchTags;
        vm.select = select;
        vm.toggleDetails = toggleDetails;

        //////////


        function add(ev) {
            openForm((vm.listCustomizations) ? 'addCustomization' : 'addItem', ev);
        }

        function changePage() {
            vm.pagination = {
                skip: vm.pagination.page * vm.pagination.limit - 10,
                limit: vm.pagination.limit,
                page: vm.pagination.page
            };

            Meteor.call('itemsList', vm.pagination, function (err, r) {
                vm.exibedItems = r.items;
                vm.total = r.total;

                $scope.$apply();
            });
        }

        function cleanItems() {
            vm.items = [];
            vm.exibedItems = [];
            vm.pagination = {
                limit: 10,
                skip: 0,
                page: 1
            };
        }

        function edit(ev, item) {
            if (vm.listCustomizations) {
                vm.selected = item || vm.selected;
                openForm('editCustomization', ev);
            } else {
                getOneItem(item || vm.selected, function () {
                    openForm('editItem', ev);
                });
            }
        }

        function getList() {


            vm.loading = true;
            Meteor.call('listCustomizations', vm.pagination, function (err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.customizations = r;
                    vm.selected = vm.customizations[0] || {};
                    vm.loading = false;
                    changePage();

                    if (vm.search['provider'].length > 3) {
                        searchText('provider');
                    } else if (vm.search['name_nd'].length > 3) {
                        searchText('name_nd');
                    }

                }
            })


        }

        function getOneItem(item, callback) {
            Meteor.call('itemGet', item._id, true, function (err, item) {
                (err) ? toast.message(err.reason) : vm.selected = item;
                callback();
            });
        }

        function info(ev, item) {
            getOneItem(item, function () {
                openForm('info', ev);
            });
        }

        function openForm(action, ev, edit) {
            var controller,
                templateUrl,
                locals,
                isAdd = false;

            switch (action) {
                case 'addItem':
                    controller = 'AdmItemsAddCtrl as vm';
                    templateUrl = 'client/app/store/items/adm.items-add.view.ng.html';
                    isAdd = true
                    locals = {}
                    break;
                case 'editItem':
                    controller = 'AdmItemsAddCtrl as vm';
                    templateUrl = 'client/app/store/items/adm.items-add.view.ng.html';
                    locals = {edit: angular.copy(vm.selected)};
                    break;
                case 'info':
                    controller = 'AdmInfoCtrl as vm';
                    templateUrl = 'client/app/store/items/adm.items.info.view.ng.html';
                    locals = {item: angular.copy(vm.selected)};
                    break;
                case 'addCustomization':
                case 'editCustomization':
                    controller = 'AdmItemsAddCustomizationCtrl as vm';
                    templateUrl = 'client/app/store/items/customizations/adm.items-add-customization.view.ng.html';
                    locals = (action == 'editCustomization') ? {edit: angular.copy(vm.selected)} : {};
                    break;
            }

            $mdDialog.show({
                controller: controller,
                templateUrl: templateUrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: locals,
                bindToController: true
            })
                .then(function (answer) {
                    getList();
                    if (isAdd) {
                        toast.message(answer.message);
                        askNewProduct(ev, answer.previousProduct)
                    } else {
                        toast.message(answer);
                    }
                });
        }

        function addNewProduct(ev, previousProduct) {
            $mdDialog.show({
                controller: 'AdmItemsAddCtrl as vm',
                templateUrl: 'client/app/store/items/adm.items-add.view.ng.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: {previousProduct},
                bindToController: true
            })
                .then(function (answer) {
                    getList();
                    toast.message(answer.message);
                    askNewProduct(ev, answer.previousProduct)
                });
        }

        function askNewProduct(ev, previousProduct) {
            var confirm = $mdDialog.confirm()
                .title('Adicionar novo produto')
                .textContent("Deseja continuar adicionando produtos?")
                .ariaLabel('Adicionar produtos')
                .targetEvent(ev)
                .ok('Continuar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function () {
                addNewProduct(ev, previousProduct);
            });
        }

        function remove(ev, item) {
            vm.selected = item || vm.selected;
            var method = (vm.listCustomizations) ? 'customizationRemove' : 'itemRemove';
            var message = (vm.listCustomizations) ? 'Customização excluída' : 'Item excluído';
            var question = (vm.listCustomizations) ? 'Deseja excluir a customização ' + vm.selected.type + '?' : 'Deseja excluir o item ' + vm.selected.name + '?';

            var confirm = $mdDialog.confirm()
                .title('Exclusão')
                .textContent(question)
                .ariaLabel('Exclusão')
                .targetEvent(ev)
                .ok('Excluir')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function () {
                Meteor.call(method, vm.selected._id, function (err, r) {
                    vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message(message);
                        getList();
                    }
                });
            });
        }

        function searchText(field) {
            if (vm.search[field].length > 3) {
                vm.progressLoading = true;
                Meteor.call('searchItems', configureString(vm.search[field]), field, function (err, r) {
                    vm.items = r;
                    vm.total = r.length;
                    vm.exibedItems = r;
                    vm.progressLoading = false;

                    $scope.$apply();
                });
            } else {
                cleanItems();
                changePage();
            }
        }

        function searchTags() {
            if (vm.search.tags.length > 0) {
                vm.loading = true;
                var tagsName = vm.search.tags.map(function (tag) {
                    return tag.name;
                });

                vm.exibedItems = [];
                angular.copy(vm.items).forEach(function (item) {
                    item.tags.forEach(function (tag) {
                        if (tagsName.indexOf(tag.name) > -1)
                            vm.exibedItems.push(item);
                    });
                });
                vm.loading = false;
            } else {
                changePage(true);
            }
        }

        function configureString(search) {
            return Diacritics.remove(search.toLowerCase()).trim();
        }

        //realiza a query de busca para um determinado md-chips
        function querySearch(query) {
            var results = query ? vm.tags.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = Diacritics.remove(angular.lowercase(query));

            return function filterFn(variable) {
                return angular.lowercase(variable.name).match(lowercaseQuery);
            };

        }

        /**
         * Select an item
         *
         * @param item
         */
        function select(item) {
            vm.selected = item;
        }

        /**
         * Toggle details
         *
         * @param item
         */
        function toggleDetails(item) {
            vm.selected = item;
            toggleSidenav('details-sidenav');
        }

    }
})();
