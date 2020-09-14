module.exports = function(ngModule) {
    ngModule.config(function($stateProvider) {
        $stateProvider
            .state('search', {
                url: '/busca/:search',
                params: {
                  search: null
                },
                views: {
                    '@': {
                        templateProvider: ['$q', function($q) {
                            var deferred = $q.defer();

                            require.ensure(['../search/search.view.html'], function() {
                                var template = require('../search/search.view.html');
                                deferred.resolve(template);
                            });

                            return deferred.promise;
                        }],
                        controller: 'SearchCtrl as vm'
                    }
                },
                resolve: {
                    loadHomeCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require('../search/search.controller.js')(ngModule);
                            $ocLazyLoad.load({ name: 'mileniomoveis' });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    }
                }
            });
    });
};
