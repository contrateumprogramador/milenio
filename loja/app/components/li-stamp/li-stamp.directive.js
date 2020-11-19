module.exports = function(ngModule) {
    require("./li-stamp.sass");

    ngModule.directive("liStamp", function() {
        return {
            restrict: "EA",
            template:
                '<span class="li-stamp" ng-show="vm.stamp" ng-class="vm.stamp.style"><md-tooltip md-direction="top" ng-show="vm.stamp && vm.stamp.description">{{ vm.stamp.description }}</md-tooltip>{{ vm.text }}</span>',
            replace: true,
            scope: {
                item: "="
            },
            controllerAs: "vm",
            controller: function($scope, $timeout, Loja) {
                var vm = this;

                function exec() {
                    vm.stamp = Loja.Store.stamp($scope.item);
                    vm.text = vm.stamp ? vm.stamp.texts[0] : "";

                    function changeText(textIndex) {
                        textIndex = textIndex ? 0 : 1;
                        if(vm.stamp) {
                            vm.text = vm.stamp.texts[textIndex];
                            $timeout(function() {
                                changeText(textIndex);
                            }, 5000);
                        }
                    }

                    if (vm.stamp && vm.stamp.texts.length > 1) changeText(1);
                }

                exec();

                $scope.$watch('item', function() {
                    exec();
                });
            }
        };
    });
};
