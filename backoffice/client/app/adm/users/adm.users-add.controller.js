(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmUsersAddCtrl', AdmUsersAddCtrl);

    /** @ngInject */
    function AdmUsersAddCtrl($mdDialog, $scope, toast) {
        var vm = this,
        company = vm.company || {
            _id: Meteor.user().profile.company.companyId,
            name: Meteor.user().profile.company.name
        };
        vm.permissions = [];
        vm.admin = Roles.userIsInRole(Meteor.userId(), 'admin');

        if(vm.admin)
            vm.companies = [company];

        vm.selectedItem = null;
        vm.searchText = null;

        var formInit = {
            profile: {
                company: {
                    companyId: company._id || Meteor.user().profile.company.companyId,
                },
                permissions: vm.permissions
            }
        };

        vm.roles = [{
            label: 'Administrador',
            value: 'admin'
        }, {
            label: 'Vendedor',
            value: 'salesman'
        }, {
            label: 'Manutenção',
            value: 'maintenance'
        }, {
            label: 'Expedição',
            value: 'expedition'
        }];

        if (Roles.userIsInRole(Meteor.userId(), 'super-admin')) {
            vm.roles.push({ label: 'API', value: 'api' });
            vm.roles.push({ label: 'Super Administrador', value: 'super-admin' });
        }

        vm.form = vm.edit || angular.copy(formInit);
        getPermissions(vm.edit);

        if (vm.edit) {
            vm.form.email = vm.edit.username;
            vm.form.roles = vm.edit.roles[0];
        }

        // Vars
        vm.companies = [company];
        vm.progressLoading = false;


        // Methods
        vm.cancel = cancel;
        vm.save = save;
        vm.querySearch = querySearch;
        vm.getPermissions = getPermissions;

        // Functions
        function cancel() {
            if (!vm.progressLoading)
                $mdDialog.cancel();
        }

        function getCompanies() {
            vm.progressLoading = true;

            Meteor.call('companiesList', function(err, r) {
                vm.progressLoading = false;
                if (err) {
                    toast.message('Erro ao listar empresas.');
                } else {
                    vm.companies = r;
                    $scope.$apply();
                }
            });
        }

        function getPermissions(edit){
            var id = (!edit) ? vm.form.profile.company.companyId : edit.profile.company.companyId;
            Meteor.call('planById', id, function(err, r) {
                vm.progressLoading = false;
                if (err) {
                    toast.message(err);
                } else {
                    vm.permissions = r.permissions;
                    if(!edit)
                        vm.form.profile.permissions = vm.permissions;
                    $scope.$apply();
                }
            });
        }

        function save() {
            vm.progressLoading = true;

            var method = vm.edit ? 'userEdit' : 'userAdd';
            var message = vm.edit ? 'Usuário editado.' : 'Usuário adicionado.';

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

        if (Roles.userIsInRole(Meteor.userId(), ['super-admin']))
            getCompanies();

        function querySearch(query) {
            var results = query ? vm.permissions.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = Diacritics.remove(angular.lowercase(query));

            return function filterFn(variable) {
                return (angular.lowercase(variable).indexOf(lowercaseQuery) > -1);
            };

        }
    }
})();
