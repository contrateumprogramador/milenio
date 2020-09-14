module.exports = function(ngModule) {
    require("./cart.sass");
    ngModule.controller("CartCtrl", function(
        $document,
        $mdDialog,
        $rootScope,
        $mdSidenav,
        $scope,
        $state,
        $stateParams,
        $location,
        Loja,
        toast,
        itemCheckout,
        Cart,
        Installments
    ) {
        var vm = this;

        if ($mdSidenav("cart").isOpen()) $mdSidenav("cart").toggle();

        // Vars
        vm.cart = Cart;
        vm.installments = vm.cart.internal
            ? {
                  times: vm.cart.installmentsMax,
                  value: vm.cart.total / vm.cart.installmentsMax
              }
            : Installments;
        vm.shippings = Loja.Checkout.getShippings;
        vm.zipcode = vm.shippings() ? vm.shippings().zipcode : "";
        vm.zipcodeDisabled = false;

        if (Loja.Checkout.isInternal()) {
            vm.zipcode =
                vm.cart.zipcode || Loja.Checkout.checkoutShipping().zipcode;
            vm.zipcodeDisabled = vm.zipcode ? true : false;
            console.log(vm.zipcodeDisabled);
        }

        //Root Scope
        $rootScope.pageTitle = "Orçamento : Milênio Móveis";

        //Inicia o checkout
        Loja.Checkout.start();

        // Methods
        vm.clearCart = clearCart;
        vm.getZip = getZip;
        vm.goToCheckout = goToCheckout;
        vm.itemRemove = itemRemove;
        vm.refreshCart = refreshCart;

        // Functions
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

        function clearCart(ev) {
            var confirm = $mdDialog
                .confirm()
                .title("Tem certeza que deseja limpar seu carrinho?")
                .targetEvent(ev)
                .ok("Sim")
                .cancel("Não");

            $mdDialog.show(confirm).then(
                function() {
                    Loja.Checkout.resetCart();
                    toast.message("Seu carrinho foi limpo!");
                    $state.go("home");
                },
                function() {}
            );
        }

        function getZip() {
            if (vm.zipcode) {
                vm.loading = true;
                Loja.Store.shipping(vm.zipcode).then(
                    function(response) {
                        Loja.Checkout.shipping(response.data.data, vm.zipcode);
                        refreshCart();
                        vm.loading = false;
                    },
                    function(err) {
                        vm.loading = false;
                        toast.message(err.data.message);
                    }
                );
            }
        }

        function itemRemove(ev, item) {
            var confirm = $mdDialog
                .confirm()
                .title("Remover Item")
                .textContent("Deseja remover o item " + item.name + "?")
                .ariaLabel("Remover")
                .targetEvent(ev)
                .ok("Remover")
                .cancel("Cancelar");

            $mdDialog.show(confirm).then(function() {
                Loja.Checkout.itemRemove(item);
                toast.message("Item removido");
                refreshCart();
            });
        }

        function refreshCart() {
            vm.cart = Loja.Checkout.cart();
            var firstItem = {};
            Object.keys(vm.cart.items).forEach(function(item, key) {
                if (key == 0) firstItem = vm.cart.items[item];
            });
            Loja.Checkout.itemInstallments(firstItem).then(function(response) {
                vm.installments = response;
            });
        }

        //Data Layers
        var dataLayerProducts = [];
        var dataLayer = (window.dataLayer = window.dataLayer || []);

        angular.forEach(vm.cart.items, function(item, key) {
            var product = {
                ecomm_prodid: item._id,
                preco_produto: item.options.salesPrice || item.options.price,
                ecomm_proname: item.name
            };

            dataLayerProducts.push(product);
        });

        dataLayer.push({
            event: "ngRouteChange",
            attributes: {
                event: "ngRouteChange",
                ecomm_pagetype: "cart",
                listProducts: dataLayerProducts,
                ecomm_totalvalue: vm.cart.total
            }
        });
    });
};
