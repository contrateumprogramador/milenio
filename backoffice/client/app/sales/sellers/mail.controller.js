'use strict'

angular.module('fuseapp')
    .controller('MailCtrl', function($filter, $mdConstant, $mdDialog, $reactive, $scope, $state, konduto, toast) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data
        vm.form = {
            recipients: []
        };
        getSettings();
        vm.customKeys = [$mdConstant.KEY_CODE.TAB, $mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];

        // Vars

        // Methods
        vm.cancel = cancel;
        vm.save = save;

        // Functions
        function cancel(argument) {
            $mdDialog.cancel();
        }

        function getSettings(){
            Meteor.call('getSettings', function(err, r) {
                (err) ? toast.message(err.reason) : vm.form = r.mailTemplate || {};
                vm.descriptions = r.descriptions;
                vm.form.attributes = r.descriptions;
                vm.form.recipients = [vm.checkout.customer.email];
            });
        }

        function maskCheckout(checkout){
            checkout.updatedAt = moment(checkout.updatedAt).format('DD/MM/YYYY');
            checkout.customer.phone = "("+checkout.customer.phone.substr(0,2)+")"+checkout.customer.phone.substr(2,5)+"-"+checkout.customer.phone.substr(7,11);
            checkout.shipping.zipcode = checkout.shipping.zipcode.substr(0,5)+"-"+checkout.shipping.zipcode.substr(5,8);
            checkout.cart.items.forEach(function(item){
                item.options.price = $filter('currency')((item.options.salesPrice) ? item.options.salesPrice : item.options.price);
                item.total = $filter('currency')(item.total);
            });

            if(checkout.cart.discountType === "%")
                checkout.cart.discount = $filter('currency')((checkout.cart.discount / 100) * checkout.cart.itemsTotal);
            else
                checkout.cart.discount = $filter('currency')(checkout.cart.discount);

            checkout.cart.itemsTotal = $filter('currency')(checkout.cart.itemsTotal);
            checkout.cart.shippingPrice = $filter('currency')(checkout.cart.shippingPrice);
            checkout.cart.total = $filter('currency')(checkout.cart.total);
            return checkout;
        }

        function save() {
            var checkout = angular.copy(vm.checkout);
            if(vm.complete)
                checkout = maskCheckout(checkout);
            Meteor.call('sendCartMail', angular.copy(vm.form), checkout, vm.complete, function(err, r){
                if(err)
                    toast.message(err.reason);
                else
                    $mdDialog.hide('E-mail enviado com sucesso.');
            });
        }

    });
