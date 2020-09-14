(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmSettingsCtrl', AdmSettingsCtrl);

    /** @ngInject */
    function AdmSettingsCtrl($mdDialog, $scope, toast, Configurations) {
        var vm = this;

        // Data
        vm.form = Configurations;

        // Vars
        vm.progressLoading = false;
        vm.selectedItem = null;
        vm.searchText = null;

        // Methods
        vm.save = save;
        vm.querySearch = querySearch;

        // Functions
        function save() {
            vm.progressLoading = true;
            Meteor.call('editSettings', angular.copy(vm.form), function(err, r) {
                if (err) {
                    vm.progressLoading = false;
                    toast.message(err.reason);
                } else {
                    vm.progressLoading = false;
                    toast.message('Configurações editadas com sucesso');
                }
            });
        };

        function querySearch(query) {
            var results = query ? vm.permissions.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = Diacritics.remove(angular.lowercase(query));

            return function filterFn(variable) {
                return angular.lowercase(variable).match(lowercaseQuery);
            };

        }
    }

})();
