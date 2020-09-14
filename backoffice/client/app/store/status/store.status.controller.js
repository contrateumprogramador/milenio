(function ()
{
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreStatusCtrl', StoreStatusCtrl);

    /** @ngInject */
    function StoreStatusCtrl($mdDialog, $mdSidenav, $scope, $state, $reactive, Status, toast){
        var vm = this;

        // Data
        vm.form = {};
        vm.status = Status[0] || {};
        vm.displaying = {};

        // Vars
        vm.dragControlListeners = {
            accept: function (sourceItemHandleScope, destSortableScope) {
                if(sourceItemHandleScope.modelValue.mandatory)
                    return false
                else
                    return true
            },//override to determine drag is allowed or not. default is true.
            itemMoved: function (event) {console.log('moveu');},
            orderChanged: function(event) {
                if(!event.source.itemScope.modelValue.mandatory && (event.dest.index == 0 || event.dest.index == 1))
                    toast.message("Posição inválida")
                else
                    reorder()
            },
            containment: '#status-view',
            clone: false, //optional param for clone feature.
            allowDuplicates: false, //optional param allows duplicates to be dropped.
            additionalPlaceholderClass: 'placeholder-drag'
        };

        // Methods
        vm.addButton = add;
        vm.edit = edit;
        vm.getList = getList;
        vm.openForm = openForm;
        vm.remove = remove;
        vm.select = select;
        vm.show = show;
        vm.toggleDetails = toggleDetails;

        //////////

        function add(ev){
            openForm('add', ev);
        }

        function edit(ev, key, status) {
            vm.selected = status;
            vm.key = key;
            openForm('edit', ev);
        }

        function getList(){
            Meteor.call('statusList', function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.status = r[0];
                    $scope.$apply();
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller,
                templateUrl,
                locals;

            switch(action) {
                case 'add':
                case 'edit':
                    controller = 'StoreStatusAddCtrl as vm';
                    templateUrl = 'client/app/store/status/store.status-add.view.ng.html';
                    locals = (action == 'edit') ? { key: vm.key, edit: angular.copy(vm.selected)} : {};
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

        function remove(ev, key, status){
            var confirm = $mdDialog.confirm()
                  .title('Exclusão')
                  .textContent('Deseja excluir o status '+status.name+'?')
                  .ariaLabel('Exclusão')
                  .targetEvent(ev)
                  .ok('Excluir')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
              Meteor.call('statusRemove', status, function (err, r){
                vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message('Status Excluído.');
                        getList();
                    }
              });
            });
        }

        function reorder(){
            Meteor.call('statusReorder', angular.copy(vm.status), function (err, r){
                vm.loadingProgress = false;

                if (err) {
                    toast.message(err.reason);
                } else {
                    toast.message('Lista reordenada.');
                }
            });
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

        function show(show, key){
            vm.displaying[key] = (show) ? 1 : 0;
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
