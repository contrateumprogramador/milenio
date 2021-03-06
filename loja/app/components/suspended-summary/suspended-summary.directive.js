module.exports = function (ngModule) {
    require('./suspended-summary.sass');
    ngModule.directive('suspendedSummary', function () {
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
                payment: '=',
                validcupom: '=',
                updateinstallments: '='
            },
            controllerAs: 'vm',
            controller: function ($mdDialog, $mdMedia, $scope, $state, $stateParams, $window, Loja, toast) {
                var vm = this;

                vm.installments = $scope.installments;
                vm.cart = $scope.cart;
                vm.refreshCart = $scope.refreshCart;
                vm.submit = $scope.submit;
                vm.validCupom = $scope.validcupom;
                vm.updateInstallments = $scope.updateinstallments;
                vm.form = $scope.form;
                vm.payment = $scope.payment;
                vm.address = Loja.Checkout.checkoutShipping();
                vm.removeCupom = Loja.Checkout.removeCoupon;
                vm.cupom = "";
                vm.errorMessageCC = "";


                $scope.$watch('cart', function (newValue) {
                    vm.cart = newValue;
                });

                $scope.$watch('form', function (newValue) {
                    vm.form = newValue;
                });

                $scope.$watch('installments', function (newValue) {
                    vm.installments = newValue;
                });

                vm.shippings = Loja.Checkout.getShippings;
                vm.zipcode = vm.shippings() ? vm.shippings().zipcode : "";
                vm.zipcodeDisabled = false;

                if (Loja.Checkout.isInternal()) {
                    vm.zipcode =
                        vm.cart.zipcode || Loja.Checkout.checkoutShipping().zipcode;
                    vm.zipcodeDisabled = !!vm.zipcode;
                }

                //Methods
                vm.goToCheckout = goToCheckout;
                vm.getZip = getZip;
                vm.getLabelButton = getLabelButton;
                vm.checkMedia = checkMedia;
                vm.getAddress = getAddress;
                vm.getLabelButtonCupom = getLabelButtonCupom;
                vm.upDateCupom = upDateCupom;

                //Functions
                function upDateCupom(ev) {
                    if (vm.cart.cupon) {
                        vm.removeCupom();
                        vm.cart = Loja.Checkout.cart();
                        vm.installments = vm.updateInstallments();
                        vm.refreshCart();
                    } else vm.validCupom(ev, vm.cupom).then(
                        r => {
                            if (r.status === 200) {
                                vm.errorMessageCC = null;
                                vm.cart = Loja.Checkout.cart();
                                vm.installments = vm.updateInstallments();
                                vm.refreshCart();
                            } else if (r.status === 404) vm.errorMessageCC = "Cupom invalido";
                            else if (r.status === 403) vm.errorMessageCC = r.data.message;
                            else vm.errorMessageCC = "Tente mais tarde";
                        }
                    );


                }


                function getLabelButtonCupom() {
                    if (!vm.cart.cupon) return "Aplicar";
                    return "Remover";
                }

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
                        if (state === "quote") {
                            $mdDialog
                                .show(
                                    $mdDialog
                                        .alert()
                                        .clickOutsideToClose(false)
                                        .title("Seu or??amento foi enviado com sucesso.")
                                        .textContent(
                                            "Entraremos em contato via telefone ou e-mail em at?? de 2 dias ??teis. Seu or??amento ficar?? salvo na sua ??rea do cliente."
                                        )
                                        .ariaLabel("Or??amento Salvo")
                                        .ok("OK")
                                )
                                .finally(function () {
                                    //Ao fechar o dialog, o carrinho ?? resetado.
                                    Loja.Checkout.resetCart();
                                    // Redireciona para a tela do usu??rio selecionando o ??ltimo or??amento
                                    $state.go("user", {actual: true});
                                });
                        } else {
                            $state.go(state, {actual: true});
                        }
                    } else {
                        // Se o usu??rio n??o estiver logado, ?? solicitado o login
                        if (Loja.Checkout.isInternal()) {
                            $state.go("checkout", {actual: true});
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
                            function (response) {
                                Loja.Checkout.shipping(response.data.data, vm.zipcode);
                                vm.refreshCart();
                                vm.loading = false;
                            },
                            function (err) {
                                vm.loading = false;
                                toast.message(err.data.message);
                            }
                        );
                    }
                }

                function getLabelButton() {
                    if (vm.payment) return "Pagar";
                    else if (vm.submit) return "Pr??ximo";
                    return "Concluir compra";
                }

                const cartContainer = document.getElementById('Content');

                const menu = document.querySelector('.suspended-summary');
                const cupon = document.querySelector('.suspended-cupom-container');

                if ($mdMedia("gt-xs") && !vm.payment && !vm.submit) {
                    cupon.style = "position:unset;width:80%;align-self:center;margin-bottom: 2rem;";
                    menu.style = "position:unset;width:80%;align-self:center";
                } else {
                    cupon.style = "display:none;";
                    // menu.style = "display:none;";
                    cartContainer.onscroll = () => {
                    };
                }
            }
        };
    });
};