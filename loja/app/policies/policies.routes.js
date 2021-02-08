module.exports = function(ngModule) {
    ngModule.config(function($stateProvider) {
        $stateProvider.state("policies", {
            url: "/termos/:url",
            views: {
                "@": {
                    templateProvider: [
                        "$q",
                        function($q) {
                            var deferred = $q.defer();

                            require.ensure(
                                ["../policies/policies.view.html"],
                                function() {
                                    var template = require("../policies/policies.view.html");
                                    deferred.resolve(template);
                                }
                            );

                            return deferred.promise;
                        }
                    ],
                    controller: "PoliciesCtrl as vm"
                }
            },
            resolve: {
                Policies: function(Loja, toast, $stateParams) {
                    return Loja.Store.terms({ url: $stateParams.url }).then(
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
                        var module = require("../policies/policies.controller.js")(
                            ngModule
                        );
                        $ocLazyLoad.load({ name: "mileniomoveis" });
                        deferred.resolve(module);
                    });

                    return deferred.promise;
                }
            }
        });
    });
};
