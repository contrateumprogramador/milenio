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
                vm.index = 0;
                vm.insideDialog = $scope.inside;

                $scope.openDialog = () => {
                    const dialog = document.getElementById('dialog')
                    const carouselDialog = document.getElementById('carousel-dialog')

                    while (carouselDialog.firstChild) dialog.appendChild(carouselDialog.firstChild)
                    dialog.style.zIndex = 1000
                }

                $scope.closeDialog = () => {
                    const dialog = document.getElementById('dialog')
                    const carouselDialog = document.getElementById('carousel-dialog')

                    while (dialog.firstChild) carouselDialog.appendChild(dialog.firstChild)
                    dialog.style.zIndex = -1
                }

                $scope.previousPicture = () => {
                    if (vm.index > 0) vm.index -= 1
                }

                $scope.nextPicture = () => {
                    if (vm.index < vm.item.pictures.length) vm.index += 1
                }
            }
        };
    });
};
