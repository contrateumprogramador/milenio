(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmCompaniesController', AdmCompaniesController);

    /** @ngInject */
    function AdmCompaniesController($scope, $mdSidenav, CompaniesList, $state, $mdDialog, toast) {
        var vm = this;

        // Data
        vm.list = CompaniesList;
        vm.selected = [CompaniesList[0]] || false;


        // Methods
        vm.addButton = add;
        vm.addUser = addUser;
        vm.edit = edit;
        vm.upToProduction = upToProduction;

        //////////

        function add(ev) {
            openForm('addCompany', ev);
        }

        function addUser(ev) {
            openForm('addUser', ev);
        }

        function edit(ev) {
            openForm('editCompany', ev);
        }

        function getList() {
            vm.progressLoading = true;

            Meteor.call('companiesList', function(err, r) {
                vm.progressLoading = false;
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.list = r;
                    vm.selected = [r[0]] || false;
                    $scope.$apply();
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller,
                templateUrl,
                locals;

            switch(action) {
                case 'addCompany':
                case 'editCompany':
                    controller = 'AdmCompaniesAddCtrl as vm';
                    templateUrl = 'client/app/adm/companies/adm.companies-add.view.ng.html';
                    locals = (action == 'editCompany') ? { edit: angular.copy(vm.selected[0]) } : {};
                    break;
                case 'addUser':
                    controller = 'AdmUsersAddCtrl as vm';
                    templateUrl = 'client/app/adm/users/adm.users-add.view.ng.html';
                    locals = { company: vm.selected[0] };
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

        function upToProduction(ev){
            var confirm = $mdDialog.confirm()
                .title('Produção')
                .textContent('Deseja colocar essa empresa em produção ? Atenção: essa ação não pode ser desfeita!')
                .ariaLabel('Produção')
                .targetEvent(ev)
                .ok('Colocar em Produção')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                vm.loadingProgress = true;
                Meteor.call('upToProduction', vm.selected[0], function(err, r) {
                    vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        getList();
                        toast.message('Empresa em produção com sucesso.');
                    }
                });
            });
        }
    }
})();
