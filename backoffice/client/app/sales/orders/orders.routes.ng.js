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
                },
                Status: function($q, toast) {
                    return $q(function(resolve, reject) {
                        var array = [];
                        Meteor.call("statusList", function(err, r) {
                            if (err) {
                                reject(err);
                            } else {
                                r[0].status.forEach(function(status) {
                                    array.push(status);
                                });
                                resolve(array);
                            }
                        });
                    });
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
                    return $auth.awaitUser(function(user) {
                        return Roles.userIsInRole(user._id, [
                            "super-admin",
                            "admin",
                            "salesman"
                        ]);
                    });
                }
            }
        });
});
