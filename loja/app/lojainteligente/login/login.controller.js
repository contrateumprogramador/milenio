module.exports = function(ngModule) {
    require("./login.sass");
    ngModule.controller("LoginCtrl", function(
        $state,
        $mdDialog,
        $scope,
        Loja,
        toast
    ) {
        var vm = this;

        // Data
        vm.customer = Loja.Auth.permission("customer") ? Loja.Auth.me() : {};

        // Vars
        vm.error = null;
        vm.tab = 0;
        vm.passwordSent = false;
        vm.phoneMask = "(99) 9999-9999";
        vm.documentMask = "999.999.999-99";

        // Methods
        vm.back = back;
        vm.cancel = cancel;
        vm.facebookLogin = facebookLogin;
        vm.formValidity = formValidity;
        vm.forgotPassword = forgotPassword;
        vm.login = login;
        vm.isCapture = isCapture;
        vm.showTerms = showTerms;

        function isCapture() {
            return vm.redirect == "capture";
        }

        function showTerms(ev) {
            $mdDialog
                .show({
                    multiple: true,
                    template: require("./dialog-terms.view.html"),
                    controllerAs: "terms",
                    controller: function(
                        $mdDialog,
                        $rootScope,
                        $scope,
                        $state,
                        Loja,
                        toast
                    ) {
                        var terms = this;

                        //Vars
                        terms.text = "";
                        terms.title = "";

                        // Methods
                        terms.hideDialog = hideDialog;

                        Loja.Store.terms().then(
                            function(r) {
                                terms.title = r.data.data[0].name;
                                terms.text = r.data.data[0].text;
                            },
                            function(err) {}
                        );

                        function hideDialog() {
                            $mdDialog.hide();
                        }
                    },
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(
                    function(answer) {
                        //$scope.status = 'You said the information was "' + answer + '".';
                    },
                    function() {
                        //$scope.status = 'You cancelled the dialog.';
                    }
                );
        }

        // Functions
        // Volta a Tab de email
        function back() {
            vm.tab = 0;
        }

        // Fecha Dialog
        function cancel() {
            $mdDialog.cancel();
        }

        function facebookLogin() {
            FB.login(
                function(response) {
                    FB.api(
                        "/me",
                        {
                            fields: ["email", "first_name", "last_name"]
                        },
                        function(response) {
                            var user = {
                                email: response.email,
                                firstname: response.first_name,
                                lastname: response.last_name,
                                facebook: true
                            };

                            Loja.Auth.register(user).then(
                                function(r) {
                                    $mdDialog.hide();
                                },
                                function(err) {
                                    // se usuário já existir, realiza login
                                    if (err.status == 304) {
                                        // faz o login do usuário no Auth
                                        Loja.Auth.login(user.email).then(
                                            function(r) {
                                                $mdDialog.hide();
                                            },
                                            function(err) {
                                                toast.message(err.data.message);
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    );
                },
                {
                    scope: "public_profile,email",
                    return_scopes: true
                }
            );
        }

        // esqueceu sua senha
        function forgotPassword() {
            Loja.Email.new_password(vm.customer.email).then(function(r) {
                vm.passwordSent = true;
            });
        }

        // Valida Form
        function formValidity() {
            var forms = ["emailForm", "signupForm", "loginForm"];
            var form = vm[forms[vm.tab]];

            if (form) return form.$valid;

            return false;
        }

        // Submit do Form
        function login() {
            switch (vm.tab) {
                // Tab Email
                case 0:
                    vm.loading = true;
                    // Confere se usuário existe
                    Loja.Auth.identify(vm.customer.email).then(
                        function(r) {
                            vm.tab = 2;
                            vm.loading = false;
                        },
                        function(err) {
                            // Se usuário não for encontrado
                            // envia para cadastro
                            if (err.status == 404) {
                                vm.tab = 1;
                            } else vm.error = err.data.message;
                            vm.loading = false;

                            // Se reposta possui customer
                            // definide dados do Customer
                            if (err.data.customer)
                                vm.customer = err.data.customer;
                        }
                    );
                    break;
                case 1:
                    //Registra novo usuário
                    vm.loading = true;
                    Loja.Auth.register(angular.copy(vm.customer)).then(
                        function(r) {
                            toast.message(
                                "Sua nova senha foi enviada para o e-mail cadastrado."
                            );
                            $mdDialog.hide();
                        },
                        function(err) {
                            vm.loading = false;
                            vm.error = err.data.message;
                        }
                    );
                    break;
                case 2:
                    // Loga usuário com a senha
                    vm.loading = true;
                    Loja.Auth.login(
                        vm.customer.email,
                        vm.customer.password
                    ).then(
                        function() {
                            $mdDialog.hide();
                        },
                        function(err) {
                            vm.loading = false;
                            vm.error = err.data.message;
                        }
                    );
                    break;
            }
        }
    });
};
