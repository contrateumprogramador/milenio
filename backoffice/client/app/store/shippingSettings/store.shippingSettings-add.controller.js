(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreShippingsAddCtrl', StoreShippingsAddCtrl);

    /** @ngInject */
    function StoreShippingsAddCtrl($http, $mdDialog, $mdSidenav, $scope, $state, toast) {
        var vm = this;

        vm.form = {};

        if(vm.edit)
            zipConfig();

        // Vars
        vm.progressLoading = false;

        // // Methods
        vm.cancel = cancel;
        vm.maskZip = maskZip;
        vm.save = save;

        //Functions

        function cancel(){
            if(!vm.progressLoading && !vm.needSave)
                $mdDialog.cancel();
        }

        function maskZip(variable){
            if(vm.form[variable] && vm.form[variable].length > 5){
                var text = vm.form[variable].substr(0,5);
                if(vm.form[variable].indexOf("-") < 0)
                    text += "-";
                text += vm.form[variable].substr(5,4);
                vm.form[variable] = text;
            }
        }

        function save(){
            var method = (vm.edit) ? 'shippingEdit' : 'shippingAdd';
            var message = (vm.edit) ? 'Ceps editados com sucesso' : 'Ceps inseridos com sucesso';
            var old = (vm.edit) ? vm.edit.zipcodes : null;
            if(vm.form.to.length < 9 || vm.form.from.length < 9){
                toast.message('Cep inválido.');
            } else {
                saveZip();
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

        function saveZip(){
            var text = vm.form.to.substr(0,5);
            text += vm.form.to.substr(6,3);
            vm.form.to = text;
            text = vm.form.from.substr(0,5);
            text += vm.form.from.substr(6,3);
            vm.form.from = text;
        }

        function zipConfig(){
            if(vm.edit.zipcodes){
                var i=0;
                vm.edit.from = vm.edit.zipcodes.start.toString();
                vm.edit.to = vm.edit.zipcodes.end.toString();
                if(vm.edit.from.length < 8){
                    for(i=vm.edit.from.length;i<8;i++)
                        vm.edit.from = "0"+vm.edit.from;
                }
                if(vm.edit.to.length < 8){
                    for(i=vm.edit.to.length;i<8;i++)
                        vm.edit.to = "0"+vm.edit.to;
                }
            }
            vm.form = vm.edit || {};
            maskZip('to');
            maskZip('from');
        }

    }

})();
