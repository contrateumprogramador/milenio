module.exports = function(LojaInteligenteModule) {
    LojaInteligenteModule.config(function($stateProvider) {
        $stateProvider
        .state('shipping', {
            url: '/checkout/endereco',
            templateProvider: ['$q', function($q) {
                var deferred = $q.defer();

                require.ensure(['../shipping/shipping.view.html'], function() {
                    var template = require('../shipping/shipping.view.html');
                    deferred.resolve(template);
                });

                return deferred.promise;
            }],
            controller: 'ShippingCtrl as vm',
            resolve: {
                Addresses: function(Loja, toast, $stateParams){
                    return Loja.Customer.addresses().then(
                        function(r) {
                            return r;
                        },
                        function(err) {
                            toast.message(err.data.message);
                        }
                    );
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
                loadShippingCtrl: function($q, $ocLazyLoad) {
                    var deferred = $q.defer();

                    require.ensure([], function() {
                        var module = require('../shipping/shipping.controller.js')(LojaInteligenteModule);
                        $ocLazyLoad.load({ name: 'mileniomoveis' });
                        deferred.resolve(module);
                    });

                    return deferred.promise;
                }
            }
        });
    });
};
