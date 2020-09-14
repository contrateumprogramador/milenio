"use strict";

angular
    .module("fuseapp")
    .controller("ComissionCtrl", function($mdDialog, $scope, toast) {
        var vm = this;

        // Data
        vm.form = {
            checkout: {
                checkoutId: vm.checkout._id,
                orderNumber: vm.checkout.orderNumber,
                itemsTotal:
                    vm.checkout.cart.total -
                    (vm.checkout.cart.shippingPrice || 0)
            },
            customer: {
                customerId: vm.checkout.customer.customerId,
                firstname: vm.checkout.customer.firstname,
                lastname: vm.checkout.customer.lastname
            },
            affiliate: vm.checkout.affiliate,
            percent: 0,
            comission: 0,
            status: "pending"
        };

        vm.progressLoading = true;

        Meteor.call(
            "Affiliate.findOne",
            { _id: vm.checkout.affiliate.affiliateId },
            function(err, r) {
                vm.progressLoading = false;
                if (err) toast.message(err.reason);
                else {
                    vm.form.percent = r.profile.comissions.rate;
                    calculate("percent");
                    $scope.$apply();
                }
            }
        );

        // Vars

        // Methods
        vm.calculate = calculate;
        vm.cancel = $mdDialog.cancel;
        vm.save = save;

        function calculate(base) {
            if (base == "comission")
                vm.form.percent =
                    (vm.form.comission / vm.form.checkout.itemsTotal) * 100;
            else
                vm.form.comission =
                    (vm.form.checkout.itemsTotal * vm.form.percent) / 100;
        }

        function save() {
            vm.progressLoading = true;
            Meteor.call("Comission.insert", angular.copy(vm.form), function(
                err,
                r
            ) {
                if (err) toast.message(err.reason);
                else $mdDialog.hide("Comissão adicionada com sucesso.");
                vm.progressLoading = true;
                $scope.$apply();
            });
        }
    });
