'use strict'

angular.module('fuseapp')
    .controller('OrdersQuestionsCtrl', function($mdDialog, $reactive, $scope, $state, toast) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data

        // Vars

        // Methods
        vm.cancel = cancel;

        // Functions
        function cancel(argument) {
            $mdDialog.cancel();
        }

    });
