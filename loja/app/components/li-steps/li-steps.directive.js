module.exports = function(ngModule) {
    require("./li-steps.sass");

    ngModule.directive("liSteps", function() {
        return {
            restrict: "EA",
            template: require("./li-steps.view.html"),
            replace: true,
            scope: {
                active: '='
            },
            controllerAs: "vm",
            controller: function($scope) {
                var vm = this;

                vm.activeStep = $scope.active
            }
        };
    });
};
