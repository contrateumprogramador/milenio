module.exports = function(ngModule) {
    require("./home.sass");
    ngModule.controller("HomeCtrl", function(
        $http,
        $mdDialog,
        $rootScope,
        $scope,
        $state,
        $location,
        Banners,
        BlocoBanners,
        Coupon,
        NewItems,
        BestSellers,
        HomeSecundario
    ) {
        var vm = this,
            ctrl = $scope.$parent.ctrl;

        //Root Scope
        $rootScope.pageTitle = "Milênio Móveis";

        if ($location.search().checkoutId) $state.go("cart");

        // Se usuário tiver acessado URL com Cupom
        if (Coupon) {
            if (Coupon.status == "success") {
                $mdDialog.show(
                    $mdDialog
                        .alert()
                        .clickOutsideToClose(false)
                        .title("Cupom de desconto adicionado!")
                        .textContent(
                            "Selecione seus produtos e conclua a compra com desconto ;)"
                        )
                        .ariaLabel("Alert Dialog Demo")
                        .ok("OK")
                );
            } else {
                $mdDialog.show(
                    $mdDialog
                        .alert()
                        .clickOutsideToClose(false)
                        .title("Cupom de desconto inválido!")
                        .textContent(Coupon.message)
                        .ariaLabel("Cupom de desconto inválido!")
                        .ok("OK")
                );
            }
        }

        // Vars
        vm.carousel = Banners || [];
        vm.blocoBanners = BlocoBanners || [];
        vm.newItems = NewItems || [];
        vm.bestSellers = BestSellers || [];
        vm.homeSecundario = HomeSecundario || [];

        // Methods

        // Data Layers
        var allProducts = vm.newItems.concat(vm.bestSellers);
        var dataLayerProducts = [];
        var dataLayer = (window.dataLayer = window.dataLayer || []);

        angular.forEach(allProducts, function(item, key) {
            var tagNames = [];
            angular.forEach(item.tags, function(item, key) {
                tagNames.push(item.name);
            });

            var product = {
                ecomm_prodid: item._id,
                preco_produto:
                    item.options[0].salesPrice || item.options[0].price,
                ecomm_procat: tagNames,
                ecomm_proname: item.name
            };

            dataLayerProducts.push(product);
        });

        dataLayer.push({
            event: "ngRouteChange",
            attributes: {
                event: "ngRouteChange",
                ecomm_pagetype: "home",
                listProducts: dataLayerProducts
            }
        });

        $http({
            method: "GET",
            url: "https://graph.instagram.com/me/media?fields=permalink,media_url",
            params: {
                access_token: "IGQVJXS3NxSlNHZAi1yTmU4U21uMVRaWTZA0MUduQnhCT0kxSk9xalhTeHhUWmJUMlZAfeVVuY0VmQUlET3dZAQ0V6eVk3TlVkX0NZAc0RKZA1BkMDdxUzNaNWx1a25kLWwzTE1MTlhybEdn"
            }
        }).then((response) => {
            vm.instaFeed = response.data.data;
        });
    });
};
