(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmCompaniesEditController', controller);

    /** @ngInject */
    function controller($mdSidenav, $http, $state, Company, toast) {
        var vm = this;

        vm.breadCrumbs = [
            {
                title: 'Administração'
            },
            {
                title: 'Empresas',
                state: 'app.adm-companies'
            }
        ];

        vm.form = Company;
        vm.progressLoading = false;

        vm.submitStepper = function() {
            vm.progressLoading = true;

            Meteor.call('companyEdit', Company._id, vm.form, function(err, r) {
                if (err) {
                    vm.progressLoading = false;

                    toast.message(err.reason);
                } else {
                    vm.progressLoading = false;
                    toast.message('Empresa editada.');

                    $state.go('app.adm-companies');
                }
            });
        };

        vm.getAddress = function() {
            if (vm.form.address != undefined && vm.form.address.zipCode != undefined) {
                vm.progressLoading = true;

                var zipCode = vm.form.address.zipCode;

                $http.get('https://viacep.com.br/ws/' + zipCode + '/json')
                    .success(function(data, status) {
                        vm.progressLoading = false;
                        vm.form.address.city = data.localidade;
                        vm.form.address.state = data.uf;
                        vm.form.address.street = data.logradouro;
                        vm.form.address.district = data.bairro;
                    })
                    .error(function(data, status) {
                        vm.progressLoading = false;

                        vm.form.address.city = '';
                        vm.form.address.state = '';
                        vm.form.address.street = '';
                        vm.form.address.district = '';

                        toast.message('Erro ao buscar endereço, tente informar o CEP novamente.');
                    });
            }
        };

        vm.states = {
            AC: 'Acre',
            AL: 'Alagoas',
            AP: 'Amapá',
            AM: 'Amazonas',
            BA: 'Bahia',
            CE: 'Ceará',
            DF: 'Distrito Federal',
            ES: 'Espírito Santo',
            GO: 'Goiás',
            MA: 'Maranhão',
            MS: 'Mato Grosso do Sul',
            MT: 'Mato Grosso',
            MG: 'Minas Gerais',
            PA: 'Pará',
            PB: 'Paraíba',
            PR: 'Paraná',
            PE: 'Pernambuco',
            PI: 'Piauí',
            RJ: 'Rio de Janeiro',
            RN: 'Rio Grande do Norte',
            RO: 'Rondônia',
            RR: 'Roraima',
            RS: 'Rio Grande do Sul',
            SC: 'Santa Catarina',
            SP: 'São Paulo',
            SE: 'Sergipe',
            TO: 'Tocantins'
        };
    }
})();
