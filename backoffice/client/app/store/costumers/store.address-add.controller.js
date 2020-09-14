(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreAddressAddCtrl', StoreAddressAddCtrl);

    /** @ngInject */
    function StoreAddressAddCtrl($http, $mdDialog, $mdSidenav, $scope, $state, toast) {
        var vm = this;

        // Vars

        vm.form = vm.edit || {};
        vm.progressLoading = false;

        // // Methods
        vm.cancel = cancel;
        vm.getAdress = getAdress;
        vm.save = save;

        //Functions

        function cancel(){
            if(!vm.progressLoading)
                $mdDialog.cancel();
        }

        function getAdress(){
            if (vm.form.address != undefined && vm.form.address.zipcode != undefined && vm.form.address.zipcode.length == 8) {
                vm.progressLoading = true;

                var zipcode = vm.form.address.zipcode;

                $http.get('https://viacep.com.br/ws/' + zipcode + '/json')
                    .success(function(data, status) {
                        vm.progressLoading = false;
                        if(data.erro){
                            vm.form.address.city = '';
                            vm.form.address.state = '';
                            vm.form.address.street = '';
                            vm.form.address.district = '';

                            $scope.formAdd.zipcode.$setValidity('cep', false);
                            toast.message('Erro ao buscar endereço, tente informar o CEP novamente.');
                        } else {
                            vm.progressLoading = false;
                            vm.form.address.city = data.localidade;
                            vm.form.address.state = data.uf;
                            vm.form.address.street = data.logradouro;
                            vm.form.address.district = data.bairro;

                            $scope.formAdd.zipcode.$setValidity('cep', true);
                        }
                    })
                    .error(function(data, status) {
                        vm.progressLoading = false;

                    });
            }
        }

        function save(){
            Meteor.call('addressRegister', Meteor.user().profile.company.companyId, angular.copy(vm.form), function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.form = {};
                    vm.progressLoading = false;
                    vm.needSave = false;
                    $mdDialog.hide('Endereço inserido com sucesso');
                }
            });
        }
    }

})();
