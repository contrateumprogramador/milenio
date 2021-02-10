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
                refreshCart: '=',
                submit: '=',
                form: '=',
                payment: '='
            },
            controllerAs: 'vm',
            controller: function($mdDialog, $mdMedia, $scope, $state, $window, Loja, toast) {
                var vm = this;

                vm.installments = $scope.installments
                vm.cart = $scope.cart
                vm.refreshCart = $scope.refreshCart
                vm.submit = $scope.submit
                vm.form = $scope.form
                vm.payment = $scope.payment
                vm.address = Loja.Checkout.checkoutShipping()

                $scope.$watch('cart', function(newValue) {
                    vm.cart = newValue;
                });

                $scope.$watch('form', function(newValue) {
                    vm.form = newValue;
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
                vm.getZip = getZip
                vm.getLabelButton = getLabelButton
                vm.checkMedia = checkMedia
                vm.getAddress = getAddress

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

                function getAddress(address) {
                    var r = address.address + ', ' + address.number;
        
                    if (address.complement)
                        r += ' ' + address.complement;
        
                    r += ' - ' + address.district;
        
                    return r;
                }

                function checkMedia(size) {
                    return $mdMedia(size);
                }

                function getZip() {
                    if (vm.zipcode) {
                        vm.loading = true;
                        Loja.Store.shipping(vm.zipcode).then(
                            function(response) {
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

                function getLabelButton() {
                    if(vm.payment) return "Pagar"
                    else if(vm.submit) return "Próximo"
                    return "Concluir compra"
                }

                const cartContainer = document.getElementById('Content')

                if ($mdMedia("gt-md") && !vm.payment && !vm.submit) {
                    const menu = document.querySelector('.suspended-summary')
                    menu.style = "position:fixed;width:17%"

                    cartContainer.onscroll = function (){                        
                        const footer = document.querySelector('#Footer')
    
                        if(menu) {
                            var offset = cartContainer.scrollTop + menu.offsetHeight;
                            var height = footer.offsetTop;
    
                            if (offset >= (height - menu.offsetHeight)) {
                                menu.style = "position:absolute;top:"+(height - menu.offsetHeight - 50)+"px;width:17%"
                            } else {
                                menu.style = "position:fixed;width:17%"
                            }
                        }
                    };
                } else {
                    cartContainer.onscroll = () => {}
                }
            }
        };
    });
};