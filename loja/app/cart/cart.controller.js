module.exports = function (ngModule) {
    require("./cart.sass");
    ngModule.controller("CartCtrl", function (
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

        // Vars
        vm.cart = Cart;
        vm.installments = vm.cart.internal ?
            {
                times: vm.cart.installmentsMax,
                value: vm.cart.total / vm.cart.installmentsMax
            } : Installments;

        //Root Scope
        $rootScope.pageTitle = "Orçamento : Milênio Móveis";

        //Inicia o checkout
        Loja.Checkout.start();

        // Methods
        vm.clearCart = clearCart;
        vm.itemRemove = itemRemove;
        vm.refreshCart = refreshCart;
        vm.validCupom = validCupom;
        vm.updateInstallments = updatesInstallments;


        // Functions
        function validCupom(ev, cupom) { //todo:criar rota especifica para validar o cupom
            return Loja.Checkout.coupon(cupom).then(
                function (r) {
                    vm.errorMessageCC = Array.isArray(r.data.data) ? "Cupom invalido" : vm.errorMessageCC = null;
                    vm.installments = Installments;
                    return r;
                },
                function (err) {
                    if (err.status === 404) vm.errorMessageCC = "Cupom invalido";
                    else if (err.status === 403) vm.errorMessageCC = err.data.message;
                    else vm.errorMessageCC = "Tente mais tarde";
                    return err;
                }
            );
        }

        function updatesInstallments() {
            return Loja.Checkout.calcInstallments();
        }

        function clearCart(ev) {
            var confirm = $mdDialog
                .confirm()
                .title("Tem certeza que deseja limpar seu carrinho?")
                .targetEvent(ev)
                .ok("Sim")
                .cancel("Não");

            $mdDialog.show(confirm).then(
                function () {
                    Loja.Checkout.resetCart();
                    toast.message("Seu carrinho foi limpo!");
                    $state.go("home");
                },
                function () {
                }
            );
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

            $mdDialog.show(confirm).then(function () {
                Loja.Checkout.itemRemove(item);
                toast.message("Item removido");
                refreshCart();
            });
        }

        function refreshCart() {
            vm.cart = Loja.Checkout.cart();
            var firstItem = {};
            Object.keys(vm.cart.items).forEach(function (item, key) {
                if (key == 0) firstItem = vm.cart.items[item];
            });
            Loja.Checkout.itemInstallments(firstItem).then(function (response) {
                vm.installments = response;
            });
        }

        //Data Layers
        var dataLayerProducts = [];
        var dataLayer = (window.dataLayer = window.dataLayer || []);

        angular.forEach(vm.cart.items, function (item, key) {
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
