'use strict';

angular
    .module('fuseapp')
    .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
        .state('app.store-shippingSettings', {
            url: '/loja/ceps',
            views: {
                'content@app': {
                    templateUrl: 'client/app/store/shippingSettings/store.shippingSettings.view.ng.html',
                    controller: 'StoreShippingsCtrl as vm'
                }
            },
            resolve: {
                user: function($auth) {
                    return $auth.awaitUser(function(user) {
                        return Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']);
                    });
                },
                CompanyShippings: function($q, toast){
                    return $q(function(resolve, reject) {
                        Meteor.call('shippingsList', function(err, r) {
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
            bodyClass: 'store-shippingSettings'
        });
}
