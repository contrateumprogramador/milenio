(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreFaqAddCtrl', StoreFaqAddCtrl);

    /** @ngInject */
    function StoreFaqAddCtrl($http, $mdDialog, $mdSidenav, $scope, $state, toast) {
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
            var method = (vm.edit) ? 'faqEdit' : 'faqAdd';
            var message = (vm.edit) ? 'Faqs editado com sucesso' : 'Faqs inserido com sucesso';
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
