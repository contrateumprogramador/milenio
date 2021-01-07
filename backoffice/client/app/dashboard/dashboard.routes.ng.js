"use strict";

angular.module("fuseapp").config(function($stateProvider) {
    $stateProvider.state("app.dashboard", {
        url: "/dashboard",
        params: {
            affiliateId: {
                value: false
            },
            affiliateName: {
                value: false
            }
        },
        views: {
            "content@app": {
                templateUrl: "client/app/dashboard/dashboard.view.ng.html",
                controller: "DashboardCtrl as vm"
            }
        },
        bodyClass: "dashboard-project",
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
        }
    });
});
