(function ()
{
    'use strict';

    angular
        .module('fuseapp')
        .controller('AdmInfoCtrl', AdmInfoCtrl);

    /** @ngInject */
    function AdmInfoCtrl($mdDialog, $mdSidenav, $scope, $state, toast, $reactive) {
        var vm = this;

        // Data
        vm.description = true;

        // Vars

        // Methods
        vm.cancel = cancel;
        vm.showDescription = showDescription;

        // Functions
        function cancel(){
            $mdDialog.cancel();
        }

        function showDescription(param){
            vm.description = param;
            vm.descriptionSize = (param) ? 50 : 10;
        }

    }
})();
