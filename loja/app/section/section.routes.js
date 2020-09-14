module.exports = function(ngModule) {
    ngModule.config(function($stateProvider) {
        $stateProvider
            .state('section', {
                url: '/mobiliario',
                abstract: true,
                views: {
                    '@': {
                        templateProvider: ['$q', function($q) {
                            var deferred = $q.defer();

                            require.ensure(['../section/section.view.html'], function() {
                                var template = require('../section/section.view.html');
                                deferred.resolve(template);
                            });

                            return deferred.promise;
                        }],
                        controller: 'SectionCtrl as vm'
                    }
                },
                resolve: {
                    loadSectionCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require('../section/section.controller.js')(ngModule);
                            $ocLazyLoad.load({ name: 'mileniomoveis' });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    }
                }
            })
            .state('section.showcase', {
                url: '/:sectionUrl',
                views: {
                    'banner@section': {
                        templateProvider: ['$q', function($q) {
                            var deferred = $q.defer();

                            require.ensure(['../section/banner.view.html'], function() {
                                var template = require('../section/banner.view.html');
                                deferred.resolve(template);
                            });

                            return deferred.promise;
                        }],
                        controller: function(Banners) {
                            var vm = this;
                            vm.banners = Banners || [];
                        },
                        controllerAs: 'vm'
                    },
                    'content@section': {
                        templateProvider: ['$q', function($q) {
                            var deferred = $q.defer();

                            require.ensure(['../section/showcase.view.html'], function() {
                                var template = require('../section/showcase.view.html');
                                deferred.resolve(template);
                            });

                            return deferred.promise;
                        }],
                        controller: 'SectionShowcaseCtrl as vm'
                    }
                },
                resolve: {
                    loadSectionShowcaseCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require('../section/showcase.controller.js')(ngModule);
                            $ocLazyLoad.load({ name: 'mileniomoveis' });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    },
                    Banners: function(Loja, toast, $stateParams) {
                        return Loja.Store.banners($stateParams.sectionUrl).then(
                            function(r) {
                                return (r.data.data[0]) ? r.data.data[0].banners : r.data.data.banners;
                            },
                            function(err) {
                                toast.message(err.data.message);
                            }
                        );
                    },
                    Items: function(Loja, toast, $stateParams) {
                        return Loja.Store.items({ 'tags.url': 'vitrine-' + $stateParams.sectionUrl }).then(
                            function(r) {
                                return r.data.data;
                            },
                            function(err) {
                                toast.message(err.data.message);
                            }
                        );
                    }
                }
            })
            .state('section.tag', {
                url: '/:sectionUrl/:tagUrl',
                views: {
                    'content@section': {
                        templateProvider: ['$q', function($q) {
                            var deferred = $q.defer();

                            require.ensure(['../section/items-list.view.html'], function() {
                                var template = require('../section/items-list.view.html');
                                deferred.resolve(template);
                            });

                            return deferred.promise;
                        }],
                        controller: 'SectionItemsListCtrl as vm'
                    }
                },
                resolve: {
                    loadSectionItemsListCtrl: function($q, $ocLazyLoad) {
                        var deferred = $q.defer();

                        require.ensure([], function() {
                            var module = require('../section/items-list.controller.js')(ngModule);
                            $ocLazyLoad.load({ name: 'mileniomoveis' });
                            deferred.resolve(module);
                        });

                        return deferred.promise;
                    },
                    Items: function(Loja, toast, $stateParams) {
                        var tags = $stateParams.sectionUrl;

                        // Se exisitir filtro, retorna os Itens da Seção com a Tag Filtrada
                        if ($stateParams.tagUrl && $stateParams.tagUrl != 'todos')
                            tags += ',' + $stateParams.tagUrl;

                        return Loja.Store.items({ 'tags.url': tags }).then(
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
