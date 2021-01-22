"use strict";

angular.module("fuseapp").config(function($stateProvider) {
    $stateProvider
        .state("app.orders", {
            url: "/pedidos",
            views: {
                "content@app": {
                    templateUrl: "client/app/sales/orders/orders.view.ng.html",
                    controller: "OrdersCtrl as vm"
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(user._id, [
                                "super-admin",
                                "admin",
                                "salesman",
                                "maintenance",
                                "expedition",
                                "affiliate"
                            ]);
                        });
                    }
                }
            },
            bodyClass: "orders"
        })
        .state("app.orders.manipulate", {
            url: "/:checkoutId",
            views: {
                "content@app": {
                    templateUrl:
                        "client/app/sales/sellers/manipulate-checkout.view.ng.html",
                    controller: "ManipulateCheckout as vm"
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(user._id, [
                                "super-admin",
                                "admin",
                                "salesman"
                            ]);
                        });
                    }
                }
            }
        });
});
