module.exports = function(ngModule) {
    require('./suspended-summary.sass');
    ngModule.directive('suspendedSummary', function() {
        return {
            restrict: 'EA',
            template: require('./suspended-summary.view.html'),
            replace: true,
            scope: {
                cart: '=',
                installments: '=',
                refreshCart: '='
            },
            controllerAs: 'vm',
            controller: function($mdDialog, $scope, $state, Loja, toast) {
                var vm = this;

                vm.installments = $scope.installments
                vm.cart = $scope.cart
                vm.refreshCart = $scope.refreshCart

                $scope.$watch('cart', function(newValue) {
                    vm.cart = newValue;
                });

                vm.shippings = Loja.Checkout.getShippings;
                vm.zipcode = vm.shippings() ? vm.shippings().zipcode : "";
                vm.zipcodeDisabled = false;

                if (Loja.Checkout.isInternal()) {
                    vm.zipcode =
                        vm.cart.zipcode || Loja.Checkout.checkoutShipping().zipcode;
                    vm.zipcodeDisabled = vm.zipcode ? true : false;
                }

                //Methods
                vm.goToCheckout = goToCheckout
                vm.getZip = getZip;

                //Functions
                function goToCheckout(state) {
                    if (Loja.Checkout.isInternal()) {
                        Loja.Checkout.budget($stateParams.number, $stateParams.code);
                    }
        
                    if (!vm.zipcode) {
                        toast.message("Informe seu CEP para continuar.");
                        angular
                            .element(document.querySelector("#ZipText"))
                            .scrollTopAnimated(550);
                        document.getElementById("ZipText").focus();
                    } else if (Loja.Auth.me()) {
                        if (state == "quote") {
                            $mdDialog
                                .show(
                                    $mdDialog
                                        .alert()
                                        .clickOutsideToClose(false)
                                        .title("Seu orçamento foi enviado com sucesso.")
                                        .textContent(
                                            "Entraremos em contato via telefone ou e-mail em até de 2 dias úteis. Seu orçamento ficará salvo na sua área do cliente."
                                        )
                                        .ariaLabel("Orçamento Salvo")
                                        .ok("OK")
                                )
                                .finally(function() {
                                    //Ao fechar o dialog, o carrinho é resetado.
                                    Loja.Checkout.resetCart();
                                    // Redireciona para a tela do usuário selecionando o último orçamento
                                    $state.go("user", { actual: true });
                                });
                        } else {
                            $state.go(state, { actual: true });
                        }
                    } else {
                        // Se o usuário não estiver logado, é solicitado o login
                        if (Loja.Checkout.isInternal()) {
                            $state.go("checkout", { actual: true });
                        } else {
                            Loja.Auth.sign(state);
                        }
                    }
                }

                function getZip() {
                    if (vm.zipcode) {
                        vm.loading = true;
                        Loja.Store.shipping(vm.zipcode).then(
                            function(response) {
                                console.log(response.data.data)
                                Loja.Checkout.shipping(response.data.data, vm.zipcode);
                                vm.refreshCart();
                                vm.loading = false;
                            },
                            function(err) {
                                vm.loading = false;
                                toast.message(err.data.message);
                            }
                        );
                    }
                }
            }
        };
    });
};