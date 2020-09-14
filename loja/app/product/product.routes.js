module.exports = function(ngModule) {
    ngModule.config(function($stateProvider) {
        $stateProvider
            .state('product', {
                url: '/movel/:productUrl/:productId',
                templateProvider: ['$q', function($q) {
                    var deferred = $q.defer();

                    require.ensure(['../product/product.view.html'], function() {
                        var template = require('../product/product.view.html');
                        deferred.resolve(template);
                    });

                    return deferred.promise;
                }],
                controller: 'ProductCtrl as vm',
                resolve: {
                    RelatedProducts: function(Loja, toast, $stateParams, Product) {
                        if (!Product.related || !Product.related.length)
                            return [];

                        var idsRelated = Product.related.join(';');

                        return Loja.Store.items({_id: idsRelated}).then(
                            function(r) {
                                return r.data.data;
                            },
                            function(err) {
                                toast.message(err.data.message);
                            }
                        );
                    },
                    Product: function(Loja, toast, $stateParams){
                        return Loja.Store.items($stateParams.productId).then(
                            function(r) {
                                return r.data.data;
                            },
                            function(err) {
                                toast.message(err.data.message);
                            }
                        );
                    },
                    loadHomeCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require('../product/product.controller.js')(ngModule);
                            $ocLazyLoad.load({ name: 'mileniomoveis' });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    }
                }
            });
    });
};
