module.exports = function(ngModule) {
    require("./li-cart-baloon.sass");

    ngModule.directive("liCartBaloon", function() {
        return {
            restrict: "EA",
            template: require("./li-cart-baloon.view.html"),
            replace: true,
            scope: {
                loja: "=",
                cart: "=",
                toogle: "&"
            },
            controllerAs: "vm",
            controller: function($scope) {
                var vm = this;

                const Loja = $scope.loja
                vm.cart = Loja.Checkout.cart;
                vm.cartSideNavIsOpen = $scope.cart

                vm.toogleCart = $scope.toogle

                $scope.$watch('cart', function() {
                    vm.cartSideNavIsOpen = $scope.cart
                });
            }
        };
    });
};
