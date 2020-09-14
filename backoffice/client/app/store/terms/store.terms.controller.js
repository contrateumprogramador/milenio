(function ()
{
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreTermsCtrl', StoreTermsCtrl);

    /** @ngInject */
    function StoreTermsCtrl($mdDialog, $mdSidenav, $scope, $state, $reactive, Terms, toast){
        var vm = this;

        // Data
        vm.form = {};
        vm.terms = Terms || {};
        vm.displaying = {};

        // Vars

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

        function edit(ev, term) {
            vm.selected = term;
            openForm('edit', ev);
        }

        function getList(){
            Meteor.call('termsList', function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.terms = r;
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
                    controller = 'StoreTermsAddCtrl as vm';
                    templateUrl = 'client/app/store/terms/store.terms-add.view.ng.html';
                    locals = (action == 'edit') ? { edit: angular.copy(vm.selected)} : {};
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

        function remove(ev, term){
            var confirm = $mdDialog.confirm()
                  .title('Exclusão')
                  .textContent('Deseja excluir os Termos '+term.name+'?')
                  .ariaLabel('Exclusão')
                  .targetEvent(ev)
                  .ok('Excluir')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
              Meteor.call('termsRemove', term, function (err, r){
                vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message('Termos Excluídos.');
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
