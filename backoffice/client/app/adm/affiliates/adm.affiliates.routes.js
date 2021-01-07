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
    $stateProvider.state("app.adm-affiliates", {
        url: "/adm/decoradores",
        views: {
            "content@app": {
                templateUrl:
                    "client/app/adm/affiliates/adm.affiliates.view.ng.html",
                controller: "AdmAffiliatesCtrl as vm"
            }
        },
        resolve: {
            user: function($auth) {
                if (Roles.subscription.ready()) {
                    return $auth.awaitUser(function(user) {
                        return Roles.userIsInRole(Meteor.userId(), ["admin"]);
                    });
                }
            },
            List: function($q, toast) {
                return $q(function(resolve, reject) {
                    Meteor.call("Affiliate.list", function(err, r) {
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
        bodyClass: "adm-affiliates"
    });
}
