module.exports = function(ngModule) {
    require("./li-card-product.sass");

    ngModule.directive("liCardProduct", function() {
        return {
            restrict: "EA",
            template: require("./li-card-product.view.html"),
            replace: true,
            scope: {
                item: "=",
                index: "="
            },
            controllerAs: "vm",
            controller: function(
                $mdDialog,
                $location,
                $scope,
                Loja
            ) {
                var vm = this;

                vm.installments = Loja.Store.itemInstallments($scope.item);
                vm.item = $scope.item;
                vm.checkoutItem = $scope.checkoutItem;
                vm.index = $scope.index;
                vm.customization = vm.checkoutItem
                    ? vm.checkoutItem.customizations
                    : {};
                vm.options = selectOptions();
                vm.quantity = vm.checkoutItem ? vm.checkoutItem.quant : 1;
                vm.addToCart = addToCart;
                vm.from = $location.path();
                vm.stamp = Loja.Store.stamp(vm.item);
                vm.disableButton = disableButton

                $scope.$watch("item", function(newValue, oldValue, scope) {
                    vm.item = newValue;
                    vm.stamp = Loja.Store.stamp(vm.item);
                    vm.installments = Loja.Store.itemInstallments(vm.item);
                });

                function addToCart() {
                    Loja.Checkout.itemAdd(
                        angular.copy(vm.item),
                        vm.quantity,
                        vm.customization,
                        vm.options,
                        true,
                        vm.index
                    );
                }

                function callDialog(ev, item) {
                    $mdDialog.show({
                        controller: "ProductDialogCtrl as vm",
                        template: require("./li-card-add-dialog.view.html"),
                        parent: angular.element(document.body),
                        locals: { item: item },
                        bindToController: true,
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: true
                    });
                }

                function selectOptions() {
                    var options = {};
                    if (vm.checkoutItem) {
                        vm.item.options.forEach(function(option, key) {
                            if (option.name == vm.checkoutItem.options.name)
                                options = vm.item.options[key];
                        });
                    } else options = vm.item.options[0];
                    return options;
                }

                function disableButton() {
                    return vm.item.stock === -1 ||
                        (vm.item.stock === 1 && !vm.item.max)
                }
            }
        };
    });
};
