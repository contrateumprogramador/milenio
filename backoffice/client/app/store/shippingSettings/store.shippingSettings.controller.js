(function ()
{
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreShippingsCtrl', StoreShippingsCtrl);

    /** @ngInject */
    function StoreShippingsCtrl($mdDialog, $mdSidenav, $scope, $state, $reactive, CompanyShippings, toast){
        var vm = this;

        // Data
        vm.form = {};
        vm.companyShippings = CompanyShippings || {};
        vm.displaying = {};
        vm.order = "rate";

        // Vars

        // Methods
        vm.addButton = add;
        vm.changeRate = changeRate;
        vm.edit = edit;
        vm.getList = getList;
        vm.openForm = openForm;
        vm.remove = remove;
        vm.select = select;
        vm.toggleDetails = toggleDetails;

        //////////

        function add(ev){
            openForm('addFaq', ev);
        }

        function changeRate(zip, down){
            Meteor.call('changeRate', zip, down, function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    toast.message('Prioridade alterada.');
                    getList();
                }
            });
        }

        function edit(ev, key, shipping) {
            shipping.key = key;
            vm.selected = shipping;
            openForm('editFaq', ev);
        }

        function getList(){
            Meteor.call('shippingsList', function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.companyShippings = r;
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller,
                templateUrl,
                locals;

            switch(action) {
                case 'addFaq':
                case 'editFaq':
                    controller = 'StoreShippingsAddCtrl as vm';
                    templateUrl = 'client/app/store/shippingSettings/store.shippingSettings-add.view.ng.html';
                    locals = (action == 'editFaq') ? { edit: angular.copy(vm.selected)} : {};
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

        function remove(ev, key, shipping){
            var confirm = $mdDialog.confirm()
                  .title('Exclusão')
                  .textContent('Deseja excluir a faixa '+shipping.title+'?')
                  .ariaLabel('Exclusão')
                  .targetEvent(ev)
                  .ok('Excluir')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
              Meteor.call('shippingRemove', shipping, function (err, r){
                vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message('Ceps Excluídos.');
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
