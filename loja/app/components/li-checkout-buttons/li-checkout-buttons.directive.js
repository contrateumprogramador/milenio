module.exports = function(ngModule) {
    require("./li-checkout-buttons.sass");

    ngModule.directive("liCheckoutButtons", function() {
        return {
            restrict: "EA",
            template: require("./li-checkout-buttons.view.html"),
            replace: true,
            scope: {
                submit: '=',
                form: '='
            },
            controllerAs: "vm",
            controller: function($mdDialog, $scope, Loja, toast) {
                var vm = this

                vm.submit = $scope.submit
                vm.form = $scope.form

                $scope.$watch('form', function(newValue) {
                    vm.form = newValue;
                });
            }
        };
    });
};
