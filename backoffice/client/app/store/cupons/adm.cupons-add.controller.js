(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmCuponsAddCtrl', AdmCuponsAddCtrl);

    /** @ngInject */
    function AdmCuponsAddCtrl($http, $mdDialog, $mdSidenav, $scope, $state, toast) {
        var vm = this;

        // Vars

        vm.types = [{
            short: "$",
            name: "Valor (R$)"
        },{
            short: "%",
            name: "Percentual (%)"
        }];

        vm.form = vm.edit || {code: Random.id([8]), discountType: '$'};
        vm.progressLoading = false;
        vm.now = new Date();

        // // Methods
        vm.cancel = cancel;
        vm.save = save;

        //Functions

        function cancel(){
            if(!vm.progressLoading && !vm.needSave)
                $mdDialog.cancel();
        }

        function save(){
            vm.progressLoading = true;
            if(vm.form.discountType == '%')
                if(vm.form.discount < 0 || vm.form.discount > 100){
                    toast.message("O percentual não pode ser fora do intervalo 0-100");
                    vm.progressLoading = false;
                    return;
                }
            var method = (vm.edit) ? 'cupomEdit' : 'cupomAdd';
            var message = (vm.edit) ? 'Cupom editado com sucesso' : 'Cupom inserido com sucesso';
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
