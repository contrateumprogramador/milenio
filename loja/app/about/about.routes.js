module.exports = function(ngModule){
    ngModule.config(function($stateProvider) {
        $stateProvider
            .state('about', {
                url: '/sobre',
                views: {
                    '@': {
                        templateProvider: ['$q', function($q) {
                            var deferred = $q.defer();

                            require.ensure(['./about.view.html'], function() {
                                var template = require('./about.view.html');
                                deferred.resolve(template);
                            });

                            return deferred.promise;
                        }],
                        controller: 'AboutCtrl as vm'
                    }
                },
                resolve: {
                    Banners: function(Loja, toast, $stateParams) {
                        return Loja.Store.banners('Sobre').then(
                            function(r) {
                                return (r.data.data[0]) ? r.data.data[0].banners : r.data.data.banners;
                            },
                            function(err) {
                                toast.message(err.data.message);
                            }
                        );
                    },
                    loadAboutCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require('../about/about.controller.js')(ngModule);
                            $ocLazyLoad.load({ name: 'mileniomoveis' });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    }
                }
            });
    });
};
