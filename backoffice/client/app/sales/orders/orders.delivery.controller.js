'use strict'

angular.module('fuseapp')
    .controller('OrdersDeliveryCtrl', function($mdDialog, $reactive, $scope, $state, konduto, toast) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data

        // Vars

        // Methods
        vm.cancel = cancel;
        vm.save = save;
        vm.removeItem = removeItem;

        // Functions
        function cancel(argument) {
            $mdDialog.cancel();
        }

        function removeItem(ev, item) {
            (Array.isArray(vm.checkout.cart.items)) ? vm.checkout.cart.items.splice(vm.checkout.cart.items.indexOf(item), 1) : delete vm.checkout.cart.items[item._id];
        }

        function save() {
            setMaxQuant();
            Meteor.call('fractionalDelivery', angular.copy(vm.checkout), angular.copy(vm.status), function(err, r){
                if(err)
                    toast.message(err.reason);
                else
                    $mdDialog.hide('Pedido fracionado com sucesso.');
            });
        }

        function setMaxQuant(setMax){
            var cart = vm.checkout.cart.items;
            if(setMax){
                Object.keys(cart).forEach(function(item){
                    cart[item].maxQuant = cart[item].quant;
                });
            } else {
                Object.keys(cart).forEach(function(item){
                    delete cart[item].maxQuant;
                });
            }
        }

        setMaxQuant(true);

    });
