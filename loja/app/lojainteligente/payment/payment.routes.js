module.exports = function(LojaInteligenteModule) {
    LojaInteligenteModule.config(function($stateProvider) {
        $stateProvider
            .state('checkout', {
                url: '/checkout/pagamento',
                templateProvider: ['$q', function($q) {
                    var deferred = $q.defer();

                    require.ensure(['../payment/payment.view.html'], function() {
                        var template = require('../payment/payment.view.html');
                        deferred.resolve(template);
                    });

                    return deferred.promise;
                }],
                controller: 'CheckoutPaymentCtrl as vm',
                resolve: {
                    Installments: function($q, Loja, toast){
                        return $q(function(resolve, reject){
                            Loja.Checkout.itemInstallments().then(function(result){
                                var i, installments = [];
                                for(i=result.times;i>0;i--){
                                    installments.push({
                                        value: (result.value * result.times) / i,
                                        times: i
                                    });
                                }
                                resolve(installments);
                            }, function(err){
                                toast.message("Os dados não puderam ser carregados.");
                                reject(err);
                            });
                        });
                    },
                    CheckoutCustomer: function(Loja, toast) {
                        return Loja.Checkout.checkoutCustomer();
                    },
                    loadPaymentCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require('../payment/payment.controller.js')(LojaInteligenteModule);
                            $ocLazyLoad.load({ name: 'mileniomoveis' });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    }
                }
            })
            .state('ticket', {
                url: '/boleto/:checkoutId',
                templateProvider: ['$q', function($q) {
                    var deferred = $q.defer();

                    require.ensure(['../payment/ticket.view.html'], function() {
                        var template = require('../payment/ticket.view.html');
                        deferred.resolve(template);
                    });

                    return deferred.promise;
                }],
                controller: 'CheckoutTicketCtrl as vm',
                resolve: {
                    Ticket: function($q, $stateParams, Loja, toast){
                        return $q(function(resolve, reject){
                            Loja.Customer.getOrder($stateParams.checkoutId).then(function(order){
                                resolve(order.data.data.ticketUrl);
                            }, function(err){
                                toast.message("Os dados não puderam ser carregados.");
                                reject(err);
                            });
                        });
                    },
                    loadTicketCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require('../payment/ticket.controller.js')(LojaInteligenteModule);
                            $ocLazyLoad.load({ name: 'mileniomoveis' });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    }
                }
            });
    });
};
