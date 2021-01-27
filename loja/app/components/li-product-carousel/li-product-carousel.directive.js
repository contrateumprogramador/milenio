module.exports = function(ngModule) {
    require("./li-product-carousel.sass");

    ngModule.directive("liProductCarousel", function() {
        return {
            restrict: "EA",
            template: require("./li-product-carousel.view.html"),
            replace: true,
            scope: {
                item: "=",
                inside: "="
            },
            controllerAs: "vm",
            controller: function($scope) {
                var vm = this;

                vm.item = $scope.item;
                vm.insideDialog = $scope.inside;
            }
        };
    });
};
