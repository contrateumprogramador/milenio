(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreCostumersAddCtrl', StoreCostumersAddCtrl);

    /** @ngInject */
    function StoreCostumersAddCtrl($http, $mdDialog, $mdSidenav, $scope, $state, toast) {
        var vm = this;

        // Vars

        vm.form = vm.edit || {};
        vm.progressLoading = false;

        // // Methods
        vm.cancel = cancel;
        vm.save = save;

        //Functions

        function cancel(){
            if(!vm.progressLoading)
                $mdDialog.cancel();
        }

        function save(){
            Meteor.call('customerRegister', angular.copy(vm.form), (vm.edit) ? true : false, function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.form = {};
                    vm.progressLoading = false;
                    vm.needSave = false;
                    $mdDialog.hide(vm.edit ? 'Cliente editado com sucesso' : 'Cliente inserido com sucesso');
                }
            });
        }
    }

})();
