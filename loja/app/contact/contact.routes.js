module.exports = function(ngModule){
    ngModule.config(function($stateProvider) {
        $stateProvider
            .state('contact', {
                url: '/contato',
                views: {
                    '@': {
                        templateProvider: ['$q', function($q) {
                            var deferred = $q.defer();

                            require.ensure(['./contact.view.html'], function() {
                                var template = require('./contact.view.html');
                                deferred.resolve(template);
                            });

                            return deferred.promise;
                        }],
                        controller: 'ContactCtrl as vm'
                    }
                },
                resolve: {
                    loadContactCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require('../contact/contact.controller.js')(ngModule);
                            $ocLazyLoad.load({ name: 'mileniomoveis' });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    }
                }
            });
    });
};
