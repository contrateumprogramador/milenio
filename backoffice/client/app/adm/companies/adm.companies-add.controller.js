(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmCompaniesAddCtrl', AdmCompaniesAddCtrl);

    /** @ngInject */
    function AdmCompaniesAddCtrl($mdDialog, cep, toast) {
        var vm = this;

        vm.form = vm.edit || {mails: {}};
        vm.progressLoading = false;
        vm.plans = getPlans();

        // Methods
        vm.cancel = cancel;
        vm.getAddress = getAddress;
        vm.save = save;
        vm.setApiUser = setApiUser;
        vm.setEmail = setEmail;

        // Get Address
        function cancel() {
            if (!vm.progressLoading)
                $mdDialog.cancel();
        }

        function getAddress() {
            if (vm.form.address != undefined && vm.form.address.zipcode != undefined && vm.form.address.zipcode.length == 8) {
                vm.progressLoading = true;

                cep.getAddress(angular.copy(vm.form.address.zipcode)).success(function(data, status) {
                    vm.progressLoading = false;
                    if (data.erro) {
                        vm.form.address.city = '';
                        vm.form.address.state = '';
                        vm.form.address.street = '';
                        vm.form.address.district = '';

                        $scope.formAdd.zipcode.$setValidity('cep', false);
                        toast.message('Não foi possível encontrar o endereço, confira o CEP.');
                    } else {
                        vm.progressLoading = false;
                        vm.form.address.city = data.localidade;
                        vm.form.address.state = data.uf;
                        vm.form.address.street = data.logradouro;
                        vm.form.address.district = data.bairro;

                        vm.formAdd.zipcode.$setValidity('cep', true);
                    }
                })
                .error(function(data, status) {
                    vm.progressLoading = false;
                    toast.message('Não foi possível encontrar o endereço, confira o CEP.');
                });
            }
        }

        function getPlans(){
            Meteor.call('plansList', function(err, r) {
                if (err) {
                    vm.progressLoading = false;

                   toast.message(err.reason);
                } else {
                    vm.plans = r;
                }
            });
        }

        function save() {
            vm.progressLoading = true;

            var method = vm.edit ? 'companyEdit' : 'companyAdd';
            var message = vm.edit ? 'Empresa editada.' : 'Empresa adicionada';

            Meteor.call(method, angular.copy(vm.form), function(err, r) {
                if (err) {
                    vm.progressLoading = false;

                   toast.message(err.reason);
                } else {
                    vm.form = {};
                    vm.progressLoading = false;

                    $mdDialog.hide(message);
                }
            });
        };

        function setEmail() {
            if(!vm.edit){
                vm.form.mails.main = vm.form.email;
                vm.form.mails.comercial = vm.form.email;
                vm.form.mails.contact = vm.form.email;
            }
        }

        function setApiUser() {
            vm.form.apiUser = vm.form.username + '@lojainteligente.com';
        }
    }
})();
