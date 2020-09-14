(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmBilletCtrl', AdmBilletCtrl);

    /** @ngInject */
    function AdmBilletCtrl($mdDialog, $scope, toast, Configurations) {
        var vm = this;

        // Data
        vm.form = Configurations;
        vm.types = [{
            short: "$",
            name: "Valor (R$)"
        },{
            short: "%",
            name: "Percentual (%)"
        }];

        // Vars
        vm.progressLoading = false;
        vm.selectedItem = null;
        vm.searchText = null;

        // Methods
        vm.newDescription = newDescription;
        vm.removeDescription = removeDescription;
        vm.save = save;
        vm.querySearch = querySearch;

        // Functions
        function newDescription(){
            vm.form.descriptions.push("");
        }

        function removeDescription(key){
            vm.form.descriptions.splice(key, 1);
        }

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
