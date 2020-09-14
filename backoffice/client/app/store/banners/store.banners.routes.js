'use strict';

angular
    .module('fuseapp')
    .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
        .state('app.store-banners', {
            url: '/loja/banners',
            views: {
                'content@app': {
                    templateUrl: 'client/app/store/banners/store.banners.view.ng.html',
                    controller: 'StoreBannersCtrl as vm'
                }
            },
            resolve: {
                user: function($auth) {
                    return $auth.awaitUser(function(user) {
                        return Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']);
                    });
                },
                CompanyBanners: function($q, toast){
                    return $q(function(resolve, reject) {
                        Meteor.call('bannersList', function(err, r) {
                            if (err) {
                                toast.message(err.reason);
                                reject('NO_DATA');
                            } else {
                                resolve(r);
                            }
                        })
                    });
                }
            },
            bodyClass: 'store-banners'
        });
}
