module.exports = function(ngModule){
    ngModule.directive('liProductList', function() {
        return {
            restrict: 'EA',
            template: require('./li-product-list.view.html'),
            replace: true,
            scope: {
                items: '=',
            },
            resolve:{
                Cart: function(Loja, toast, $stateParams){
                    return Loja.Checkout.cart();
                }
            },
            controllerAs: 'vm',
            controller: function($mdDialog, $rootScope, $scope, Loja) {
                var vm = this,
                    ctrl = $scope.$parent.ctrl;

                // Methods
                vm.editDetails = editDetails;
                
                function editDetails(ev, item){
                  Loja.Store.items(item._id).then(function(response){
                    callDialog(ev, response.data.data, item);
                  });

                  if (!ctrl.checkMedia('gt-sm'))
                    ctrl.toggleSidenav('cart', 'close');
                }

                function callDialog(ev, item, checkoutItem){
                  $mdDialog.show({
                      controller: 'ProductDialogCtrl as vm',
                      template: require('../li-card-product/li-card-add-dialog.view.html'),
                      parent: angular.element(document.body),
                      locals: {item: item, checkoutItem: angular.copy(checkoutItem)},
                      bindToController: true,
                      targetEvent: ev,
                      clickOutsideToClose: false,
                      fullscreen: true
                  }).then(function(answer){
                    //refreshCart();
                  });
                }
            }
        };
    });
};
