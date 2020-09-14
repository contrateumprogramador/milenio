(function ()
{
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmCuponsCtrl', AdmCuponsCtrl);

    /** @ngInject */
    function AdmCuponsCtrl($mdDialog, $mdSidenav, $scope, $state, $reactive, CuponsList, toast){
        var vm = this;

        // Data
        vm.form = {};
        vm.cupons = CuponsList || [];
        vm.selected = vm.cupons[0] || {};
        vm.now = new Date();

        // Vars

        // Methods
        vm.addButton = add;
        vm.edit = edit;
        vm.getList = getList;
        vm.openForm = openForm;
        vm.remove = remove;
        vm.select = select;
        vm.toggleDetails = toggleDetails;

        //////////

        function add(ev){
            openForm('addCupom', ev);
        }

        function edit(ev, cupom) {
            vm.selected = cupom;
            openForm('editCupom', ev);
        }

        function getList(){
            Meteor.call('cuponsList', function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.cupons = r;
                    vm.selected = vm.cupons[0] || {};
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller,
                templateUrl,
                locals;

            switch(action) {
                case 'addCupom':
                case 'editCupom':
                    controller = 'AdmCuponsAddCtrl as vm';
                    templateUrl = 'client/app/store/cupons/adm.cupons-add.view.ng.html';
                    locals = (action == 'editCupom') ? { edit: angular.copy(vm.selected) } : {};
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

        function remove(ev, cupom){
            var confirm = $mdDialog.confirm()
                  .title('Exclusão')
                  .textContent('Deseja excluir o cupom '+cupom.code+'?')
                  .ariaLabel('Exclusão')
                  .targetEvent(ev)
                  .ok('Excluir')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
              Meteor.call('cupomRemove', cupom._id, function (err, r){
                vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message('Cupom excluído.');
                        getList();
                    }
              });
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
