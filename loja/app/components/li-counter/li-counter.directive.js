module.exports = function(ngModule) {
    require("./li-counter.sass");

    ngModule.directive("liCounter", function() {
        return {
            restrict: "EA",
            template: require("./li-counter.view.html"),
            replace: true,
            scope: {
                item: '=',
                refreshCart: '='
            },
            controllerAs: "vm",
            controller: function($mdDialog, $scope, Loja, toast) {
                var vm = this;

                vm.changeQuant = changeQuant
                vm.item = $scope.item
                vm.refreshCart = $scope.refreshCart;
                vm.itemRemove = itemRemove

                function changeQuant(item, value, ev, index){
                    if(item.stock === 1) {
                      if(item.quant + value <= item.max) item.quant += value;
                    } else if(item.quant + value === 0) {
                        itemRemove(ev, item, index)
                    } else {
                        item.quant += value;
                    }
  
                    Loja.Checkout.itemQuantChange(item, item.quant);
                    
                    if (!vm.parent)
                        vm.refreshCart();
                }

                function itemRemove(ev, item, index){
                  var confirm = $mdDialog.confirm()
                        .title('Remover Item')
                        .textContent('Deseja remover o item '+ item.name +'?')
                        .ariaLabel('Remover')
                        .targetEvent(ev)
                        .ok('Remover')
                        .cancel('Cancelar');

                  $mdDialog.show(confirm).then(function() {
                    Loja.Checkout.itemRemove(item, index);
                    toast.message("Item removido");
                    if (!vm.parent)
                        vm.refreshCart();
                  });
                }
            }
        };
    });
};
