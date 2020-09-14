(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreStatusAddCtrl', StoreStatusAddCtrl);

    /** @ngInject */
    function StoreStatusAddCtrl($http, $mdDialog, $mdSidenav, $scope, $state, toast) {
        var vm = this;

        // Vars
        vm.form = vm.edit || { email: true };
        vm.progressLoading = false;

        // // Methods
        vm.cancel = cancel;
        vm.save = save;

        //Functions

        function cancel(){
            if(!vm.progressLoading && !vm.needSave)
                $mdDialog.cancel();
        }

        function save(){
            var method = (vm.edit) ? 'statusEdit' : 'statusAdd';
            var message = (vm.edit) ? 'Status editado com sucesso' : 'Status inserido com sucesso';
            Meteor.call(method, angular.copy(vm.form), vm.key, function(err, r) {
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
