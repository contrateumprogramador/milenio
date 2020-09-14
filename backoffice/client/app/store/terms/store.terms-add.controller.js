(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreTermsAddCtrl', StoreTermsAddCtrl);

    /** @ngInject */
    function StoreTermsAddCtrl($http, $mdDialog, $mdSidenav, $scope, $state, toast) {
        var vm = this;

        // Vars
        vm.form = vm.edit || {};
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
            var method = (vm.edit) ? 'termsEdit' : 'termsAdd';
            var message = (vm.edit) ? 'Termos editados com sucesso' : 'Termos inseridos com sucesso';
            Meteor.call(method, angular.copy(vm.form), function(err, r) {
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
