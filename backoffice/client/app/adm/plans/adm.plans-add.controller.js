(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmPlansAddCtrl', AdmPlansAddCtrl);

    /** @ngInject */
    function AdmPlansAddCtrl($mdDialog, $scope, toast) {
        var vm = this;
        vm.permissions = ['store'];  
        vm.form = vm.edit || {permissions:vm.permissions};

        // Vars
        vm.progressLoading = false;
        vm.companies = [];
        vm.selectedItem = null;
        vm.searchText = null;

        // Methods
        vm.cancel = cancel;
        vm.save = save;      
        vm.querySearch = querySearch;        

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

        function save() {
            vm.progressLoading = true;

            var method = vm.edit ? 'planEdit' : 'planAdd';
            var message = vm.edit ? 'Plano editado.' : 'Plano adicionado.';

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
