"use strict";

angular.module("fuseapp").config(function($stateProvider) {
    $stateProvider
        .state("app.funnel", {
            url: "/funil",
            views: {
                "content@app": {
                    templateUrl: "client/app/sales/funnel/funnel.view.ng.html",
                    controller: "FunnelCtrl as vm"
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
            bodyClass: "sales"
        })
        .state("app.funnel.manipulate", {
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
                                "salesman",
                                "expedition",
                                "affiliate"
                            ]);
                        });
                    }
                },
                Checkout: function($stateParams, $q, toast) {
                    if (!$stateParams.checkoutId) return;

                    return $q(function(resolve, reject) {
                        Meteor.call(
                            "getCheckout",
                            $stateParams.checkoutId,
                            function(err, r) {
                                if (err) {
                                    toast.message(err.reason);
                                    reject("NO_DATA");
                                } else {
                                    resolve(r);
                                }
                            }
                        );
                    });
                },
                CheckoutNumber: function($q, toast) {
                    return $q(function(resolve, reject) {
                        Meteor.call("getCheckoutNumber", function(err, r) {
                            if (err) {
                                toast.message(err.reason);
                                reject("NO_DATA");
                            } else {
                                resolve(r);
                            }
                        });
                    });
                }
            }
        });
});
