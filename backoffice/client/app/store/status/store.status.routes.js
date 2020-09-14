'use strict';

angular
    .module('fuseapp')
    .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
        .state('app.store-status', {
            url: '/loja/status',
            views: {
                'content@app': {
                    templateUrl: 'client/app/store/status/store.status.view.ng.html',
                    controller: 'StoreStatusCtrl as vm'
                }
            },
            resolve: {
                user: function($auth) {
                    return $auth.awaitUser(function(user) {
                        return Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']);
                    });
                },
                Status: function($q, toast){
                    return $q(function(resolve, reject) {
                        Meteor.call('statusList', function(err, r) {
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
            bodyClass: 'store-status'
        });
}
