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
                vm.changeTab = changeTab;

                $scope.$watch("liContent", function(newValue, oldValue, scope) {
                    vm.tabs = newValue;
                });

                function url(tab) {
                    return tab.urlMobile && $mdMedia("xs")
                        ? tab.urlMobile
                        : tab.url;
                }

                function changeTab(page){
                    if (vm.selected < vm.tabs.length - 1 && page > 0)
                        vm.selected += page;
                    else if(vm.selected > 0 && page < 0)
                        vm.selected--;
                }
            }
        };
    });
};
