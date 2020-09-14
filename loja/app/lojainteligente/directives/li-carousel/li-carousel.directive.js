module.exports = function(ngModule) {
    require("./li-carousel.sass");
    ngModule.directive("liCarousel", function() {
        return {
            restrict: "EA",
            template: require("./li-carousel.view.html"),
            replace: true,
            scope: {
                liContent: "=",
                liInterval: "="
            },
            controllerAs: "vm",
            controller: function($scope, $timeout, $mdMedia) {
                var vm = this;
                // Vars
                vm.interval = $scope.liInterval || 0;
                vm.selected = 0;
                vm.tabs = $scope.liContent || [];
                vm.url = url;

                $scope.$watch("liContent", function(newValue, oldValue, scope) {
                    vm.tabs = newValue;
                });

                // Functions
                function change() {
                    $timeout(function() {
                        if (
                            vm.selected < vm.tabs.length - 1
                                ? vm.tabs.length - 1
                                : 0
                        ) {
                            vm.selected++;
                        } else {
                            vm.selected = 0;
                        }
                        change();
                    }, vm.interval);
                }

                function url(tab) {
                    return tab.urlMobile && $mdMedia("xs")
                        ? tab.urlMobile
                        : tab.url;
                }

                if (vm.interval) change();
            }
        };
    });
};
