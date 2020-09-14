module.exports = function(ngModule) {
    ngModule.config(function($stateProvider) {
        $stateProvider.state("user", {
            url: "/cliente",
            params: {
                actual: null,
                actualOrder: null
            },
            views: {
                "@": {
                    templateProvider: [
                        "$q",
                        function($q) {
                            var deferred = $q.defer();

                            require.ensure(["./user.view.html"], function() {
                                var template = require("./user.view.html");
                                deferred.resolve(template);
                            });

                            return deferred.promise;
                        }
                    ],
                    controller: "UserCtrl as vm"
                }
            },
            resolve: {
                loadUserCtrl: function($q, $ocLazyLoad) {
                    var deferred = $q.defer();

                    require.ensure([], function() {
                        var module = require("./user.controller.js")(ngModule);
                        $ocLazyLoad.load({ name: "mileniomoveis" });
                        deferred.resolve(module);
                    });

                    return deferred.promise;
                },
                Addresses: function(Loja, toast) {
                    return Loja.Customer.addresses().then(
                        function(r) {
                            return r;
                        },
                        function(err) {
                            toast.message(err.data.message);
                        }
                    );
                },
                Carts: function(Loja, toast) {
                    return Loja.Customer.carts().then(
                        function(r) {
                            return r.data.data;
                        },
                        function(err) {
                            toast.message(err.data.message);
                        }
                    );
                },
                Customer: function(Loja, toast) {
                    return Loja.Auth.meCustomer().then(
                        function(r) {
                            return r.data.data;
                        },
                        function(err) {
                            toast.message(err.data.message);
                        }
                    );
                },
                Orders: function(Loja, toast) {
                    return Loja.Customer.orders().then(
                        function(r) {
                            return r.data.data;
                        },
                        function(err) {
                            toast.message(err.data.message);
                        }
                    );
                }
            }
        });
    });
};
