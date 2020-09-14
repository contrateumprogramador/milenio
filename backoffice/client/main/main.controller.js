(function() {
    "use strict";

    angular.module("fuse").controller("MainCtrl", MainCtrl);

    /** @ngInject */
    function MainCtrl($rootScope, $scope) {
        $rootScope.appName = "Loja Inteligente";
        // $rootScope.pageTitle =
        //     Meteor.user() && Meteor.user().profile.company
        //         ? "Loja Inteligente : " + Meteor.user().profile.company.name
        //         : "Loja Inteligente";

        // Methods
        $rootScope.userIsInRole = userIsInRole;

        if (!$rootScope.company)
            Meteor.call("companyUser", (err, r) => {
                if (!err) $rootScope.company = r;

                $scope.$apply();
            });

        // Function
        function userIsInRole(role) {
            return Roles.userIsInRole(Meteor.userId(), role);
        }

        //////////

        // Remove the splash screen
        $scope.$on("$viewContentAnimationEnded", function(event) {
            if (event.targetScope.$id === $scope.$id) {
                $rootScope.$broadcast("msSplashScreen::remove");
            }
        });
    }
})();
