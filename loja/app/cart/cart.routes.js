module.exports = function(ngModule) {
    ngModule.config(function($stateProvider) {
        $stateProvider
            .state("cart", {
                url: "/orcamento",
                templateProvider: [
                    "$q",
                    function($q) {
                        var deferred = $q.defer();

                        require.ensure(["../cart/cart.view.html"], function() {
                            var template = require("../cart/cart.view.html");
                            deferred.resolve(template);
                        });

                        return deferred.promise;
                    }
                ],
                controller: "CartCtrl as vm",
                resolve: {
                    Cart: function(Loja, toast, $stateParams, $q, $location) {
                        if ($stateParams.number && $stateParams.code) {
                            return $q(function(resolve, reject) {
                                Loja.Checkout.budget(
                                    $stateParams.number,
                                    $stateParams.code,
                                    $location.search().view ? false : true
                                ).then(
                                    function(r) {
                                        resolve(Loja.Checkout.cart());
                                    },
                                    function(err) {
                                        reject();
                                    }
                                );
                            });
                        } else {
                            return Loja.Checkout.cart();
                        }
                    },
                    Installments: function($q, Loja, toast) {
                        return $q(function(resolve, reject) {
                            var items = Loja.Checkout.cart().items,
                                firstItem = {};
                            Object.keys(items).forEach(function(item, key) {
                                if (key == 0) firstItem = items[item];
                            });
                            Loja.Checkout.itemInstallments(firstItem).then(
                                function(response) {
                                    resolve(response);
                                },
                                function(err) {
                                    reject(err);
                                }
                            );
                        });
                    },
                    loadHomeCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require("../cart/cart.controller.js")(
                                ngModule
                            );
                            $ocLazyLoad.load({ name: "mileniomoveis" });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    }
                }
            })
            .state("cart.budget", {
                url: "/:number/:code"
            });
    });
};
