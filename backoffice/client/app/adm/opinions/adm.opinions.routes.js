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
    $stateProvider.state("app.adm-opinions", {
        url: "/adm/opinioes",
        views: {
            "content@app": {
                templateUrl:
                    "client/app/adm/opinions/adm.opinions.view.ng.html",
                controller: "AdmOpinionsCtrl as vm"
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
                    Meteor.call("Opinions.list", function(err, r) {
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
