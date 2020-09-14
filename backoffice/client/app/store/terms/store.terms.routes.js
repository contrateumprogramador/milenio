'use strict';

angular
    .module('fuseapp')
    .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
        .state('app.store-terms', {
            url: '/loja/termos',
            views: {
                'content@app': {
                    templateUrl: 'client/app/store/terms/store.terms.view.ng.html',
                    controller: 'StoreTermsCtrl as vm'
                }
            },
            resolve: {
                user: function($auth) {
                    return $auth.awaitUser(function(user) {
                        return Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']);
                    });
                },
                Terms: function($q, toast){
                    return $q(function(resolve, reject) {
                        Meteor.call('termsList', function(err, r) {
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
            bodyClass: 'store-terms'
        });
}
