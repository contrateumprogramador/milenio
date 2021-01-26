module.exports = function(ngModule) {
    require("./li-card-showcase.sass");

    ngModule.directive("liCardShowcase", function() {
        return {
            restrict: "EA",
            template: require("./li-card-showcase.view.html"),
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

                vm.item = $scope.item;
                vm.index = $scope.index;
                vm.from = $location.path();
                vm.stamp = Loja.Store.stamp(vm.item);
                vm.openShowcase = openShowcase

                $scope.$watch("item", function(newValue, oldValue, scope) {
                    vm.item = newValue;
                    vm.stamp = Loja.Store.stamp(vm.item);
                });

                function openShowcase(ev) {
                    $mdDialog.show({
                        controller: "CardShowcaseDialogCtrl as vm",
                        template: require("./li-card-showcase-dialog.view.html"),
                        parent: angular.element(document.body),
                        locals: { item: vm.item },
                        bindToController: true,
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: true
                    });
                }
            }
        };
    });
};
