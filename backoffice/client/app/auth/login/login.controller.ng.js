(function() {
    "use strict";

    angular.module("fuseapp").controller("LoginController", LoginController);

    /** @ngInject */
    function LoginController($scope, $state, $rootScope, toast) {
        var vm = this;

        vm.loading = false;
        vm.step = "login";

        vm.form = {
            email: "",
            password: ""
        };

        vm.cpForm = { password: "", passwordConfirmation: "" };

        vm.login = function() {
            vm.loading = true;
            Meteor.loginWithPassword(vm.form.email, vm.form.password, function(
                err,
                r
            ) {
                if (err) {
                    toast.message("Usuário ou senha incorretos.");
                } else {
                    if (
                        Roles.userIsInRole(Meteor.userId(), "affiliate") &&
                        !Meteor.user().profile.passwordChanged
                    ) {
                        vm.step = "changePassword";
                    } else $state.go("app.dashboard");

                    Meteor.call("companyUsers", function(err, r) {
                        if (err) {
                            toast.message(err.reason);
                            $rootScope.companyUsers = false;
                        } else {
                            $rootScope.companyUsers = r;
                        }
                    });
                }
                vm.loading = false;
            });
        };

        vm.changePassword = function() {
            vm.loading = true;
            Accounts.changePassword(
                vm.form.password,
                vm.cpForm.password,
                function(err, r) {
                    vm.loading = false;
                    if (err) toast.message(err.reason);
                    else
                        Meteor.call(
                            "userPasswordChanged",
                            Meteor.userId(),
                            function(err, r) {
                                if (err) toast.message(err.reason);
                                else $state.go("app.dashboard");
                            }
                        );
                }
            );
        };

        vm.passwordRecover = function() {
            vm.loading = true;

            Meteor.call("userPasswordRecover", vm.form.email, function(err, r) {
                vm.loading = false;
                if (err) toast.message("Usuário ou senha incorretos.");
                else {
                    vm.step = "login";
                    vm.passwordSent = true;
                    $scope.$apply();
                }
            });
        };
    }
})();
