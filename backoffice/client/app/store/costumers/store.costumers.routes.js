"use strict";

angular.module("fuseapp").config(config);

/** @ngInject */
function config(
    $stateProvider,
    $translatePartialLoaderProvider,
    msApiProvider,
    msNavigationServiceProvider
) {
    // State
    $stateProvider.state("app.store-costumers", {
        url: "/loja/clientes",
        views: {
            "content@app": {
                templateUrl:
                    "client/app/store/costumers/store.costumers.view.ng.html",
                controller: "StoreCustomersCtrl as vm"
            }
        },
        resolve: {
            user: function($auth) {
                return $auth.awaitUser(function(user) {
                    return Roles.userIsInRole(Meteor.userId(), [
                        "admin",
                        "salesman",
                        "expedition",
                        "affiliate"
                    ]);
                });
            },
            CustomersList: function($q, toast) {
                return $q(function(resolve, reject) {
                    Meteor.call("customersList", false, 0, 10, function(
                        err,
                        r
                    ) {
                        if (err) {
                            toast.message(err.reason);
                            reject("NO_DATA");
                        } else {
                            resolve(r);
                        }
                    });
                });
            }
        },
        bodyClass: "store-costumers"
    });
}
