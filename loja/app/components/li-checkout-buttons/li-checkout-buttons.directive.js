module.exports = function(ngModule) {
    require("./li-checkout-buttons.sass");

    ngModule.directive("liCheckoutButtons", function() {
        return {
            restrict: "EA",
            template: require("./li-checkout-buttons.view.html"),
            replace: true,
            scope: {
                submit: '=',
                form: '=',
                step: '=',
                customNext: '='
            },
            controllerAs: "vm",
            controller: function($mdDialog, $scope, $state, Loja, toast) {
                var vm = this

                vm.submit = $scope.submit
                vm.form = $scope.form
                vm.step = $scope.step
                vm.customNext = $scope.customNext

                $scope.$watch('form', function(newValue) {
                    vm.form = newValue;
                });

                $scope.$watch('step', function(newValue) {
                    vm.step = newValue
                });

                vm.go = go

                function go(state) {
                    $state.go(state)
                }
            }
        };
    });
};
