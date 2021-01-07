(function ()
{
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmItemsCtrl', AdmItemsCtrl);

    /** @ngInject */
    function AdmItemsCtrl($filter, $mdDialog, $mdSidenav, $scope, $state, $reactive, Customizations, Items, Tags, toast){
        var vm = this;

        // Data
        vm.form = {};
        vm.customizations = Customizations;
        vm.selected = vm.customizations[0] || {};
        vm.items = Items.items;
        vm.searchedItems = [];
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
        vm.label = {
            page: "Página",
            of: "de"
        };
        vm.search = {
          name: "",
          tags: []
        };
        vm.selectedItem = null;
        vm.searchText = null;
        vm.loading = false;
        changePage(true);

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
        vm.searchName = searchName;
        vm.searchTags = searchTags;
        vm.select = select;
        vm.toggleDetails = toggleDetails;

        //////////

        function add(ev){
            openForm((vm.listCustomizations) ? 'addCustomization' : 'addItem', ev);
        }

        function changePage(first){
            vm.pagination = {
                skip: vm.pagination.page*vm.pagination.limit-10,
                limit: vm.pagination.limit,
                page: vm.pagination.page
            };

            if(vm.searchedItems.length){
                vm.exibedItems = angular.copy(vm.searchedItems).splice(
                    vm.pagination.page*vm.pagination.limit-10,
                    vm.pagination.limit
                );
            } else {
                Meteor.call('itemsList', vm.pagination, function(err, r){
                    vm.exibedItems = r.items;
                    vm.total = r.total;

                    $scope.$apply();
                });
            }
        }

        function cleanItems(){
            vm.items = [];
            vm.searchedItems = [];
            vm.exibedItems = [];
            vm.pagination = {
                limit: 10,
                skip: 0,
                page: 1
            };
        }

        function edit(ev, item) {
          if(vm.listCustomizations){
            vm.selected = item || vm.selected;
            openForm('editCustomization', ev);
          } else {
            getOneItem(item || vm.selected, function(){
              openForm('editItem', ev);
            });
          }
        }

        function getList(){
            vm.loading = true;
            Meteor.call('listCustomizations', vm.pagination, function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.customizations = r;
                    vm.selected = vm.customizations[0] || {};
                    vm.loading = false;
                    changePage();
                }
            });
        }

        function getOneItem(item, callback){
          Meteor.call('itemGet', item._id, true, function(err, item) {
            (err) ? toast.message(err.reason) : vm.selected = item;
            callback();
          });
        }

        function info(ev, item){
            getOneItem(item, function(){
              openForm('info', ev);
            });
        }

        function openForm(action, ev, edit) {
            var controller,
                templateUrl,
                locals;

            switch(action) {
                case 'addItem':
                case 'editItem':
                    controller = 'AdmItemsAddCtrl as vm';
                    templateUrl = 'client/app/store/items/adm.items-add.view.ng.html';
                    locals = (action == 'editItem') ? { edit: angular.copy(vm.selected) } : {};
                    break;
                case 'info':
                    controller = 'AdmInfoCtrl as vm';
                    templateUrl = 'client/app/store/items/adm.items.info.view.ng.html';
                    locals = { item: angular.copy(vm.selected) };
                    break;
                case 'addCustomization':
                case 'editCustomization':
                    controller = 'AdmItemsAddCustomizationCtrl as vm';
                    templateUrl = 'client/app/store/items/customizations/adm.items-add-customization.view.ng.html';
                    locals = (action == 'editCustomization') ? { edit: angular.copy(vm.selected) } : {};
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
                .then(function(answer) {
                    getList();
                    toast.message(answer);
                });
        }

        function remove(ev, item){
            vm.selected = item || vm.selected;
            var method = (vm.listCustomizations) ? 'customizationRemove' : 'itemRemove';
            var message = (vm.listCustomizations) ? 'Customização excluída' : 'Item excluído';
            var question = (vm.listCustomizations) ? 'Deseja excluir a customização '+vm.selected.type+'?' : 'Deseja excluir o item '+vm.selected.name+'?';

            var confirm = $mdDialog.confirm()
                  .title('Exclusão')
                  .textContent(question)
                  .ariaLabel('Exclusão')
                  .targetEvent(ev)
                  .ok('Excluir')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
              Meteor.call(method, vm.selected._id, function (err, r){
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

        function searchName(){
            if(vm.search.name.length > 3){
                vm.progressLoading = true;
                if(vm.items.length == 0){
                    Meteor.call('searchItems', configureString(vm.search.name), function(err, r){
                        vm.items = r;
                        vm.total = r.length;
                        vm.searchedItems = r;
                        vm.progressLoading = false;
                        changePage(true);
                    });
                } else {
                    vm.searchedItems = $filter('filter')(angular.copy(vm.items), { name_nd: configureString(vm.search.name) });
                    vm.progressLoading = false;
                    vm.total = vm.searchedItems.length;
                    changePage(true);
                }
            } else {
                cleanItems();
                changePage();
            }
        }

        function searchTags(){
          if(vm.search.tags.length > 0){
            vm.loading = true;
            var tagsName = vm.search.tags.map(function(tag){
              return tag.name;
            });

            vm.exibedItems = [];
            angular.copy(vm.items).forEach(function(item){
              item.tags.forEach(function(tag){
                if(tagsName.indexOf(tag.name) > -1)
                  vm.exibedItems.push(item);
              });
            });
            vm.loading = false;
          } else {
            changePage(true);
          }
        }

        function configureString(search){
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
        function select(item)
        {
            vm.selected = item;
        }

        /**
         * Toggle details
         *
         * @param item
         */
        function toggleDetails(item)
        {
            vm.selected = item;
            toggleSidenav('details-sidenav');
        }

    }
})();
