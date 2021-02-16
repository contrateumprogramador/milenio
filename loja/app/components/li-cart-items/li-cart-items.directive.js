module.exports = function(ngModule){
    require('./li-cart-items.sass');
    ngModule.directive('liCartItems', function() {
        return {
            restrict: 'EA',
            template: require('./li-cart-items.view.html'),
            replace: true,
            controllerAs: 'vm',
            scope: {
                parent: '=',
                refreshCart: '=',
                items: '=',
                cartInternal: '='  
            },
            controller: function($scope, $timeout, $rootScope, $mdMedia, $mdDialog, toast,Loja) {
                var vm = this,
                    ctrl = $scope.$parent.ctrl;

                // Vars
                vm.items = $scope.items;
                vm.parent = $scope.parent;
                vm.blocked = $scope.cartInternal;

                $scope.$watch('items', function(newValue, oldValue, scope) {
                    vm.items = newValue;
                });

                //Methods
                vm.editDetails = editDetails;
                vm.refreshCart = $scope.refreshCart;
                vm.checkMedia = checkMedia;

                // Functions
                function callDialog(ev, item, checkoutItem, index){
                  $mdDialog.show({
                      controller: 'ProductDialogCtrl as vm',
                      template: require('../li-card-product/li-card-add-dialog.view.html'),
                      parent: angular.element(document.body),
                      locals: {item: item, checkoutItem: angular.copy(checkoutItem), index: index},
                      bindToController: true,
                      targetEvent: ev,
                      clickOutsideToClose: false,
                      fullscreen: true
                  }).then(function(answer){
                    if (!vm.parent)
                        vm.refreshCart();
                  });
                }

                function checkMedia(size) {
                    return $mdMedia(size);
                }

                function editDetails(ev, item, index){
                  Loja.Store.items(item._id).then(function(response){
                    if (!ctrl.checkMedia('gt-md', 'close'))
                      ctrl.toggleSidenav('cart', 'close');
                    callDialog(ev, response.data.data, item, index);
                  });
                }
            }
        };
    });
};
