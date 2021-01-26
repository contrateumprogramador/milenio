'use strict';

angular
    .module('fuseapp')
    .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
        .state('app.store-environments', {
            url: '/loja/ambientes',
            views: {
                'content@app': {
                    templateUrl: 'client/app/store/environments/store.environments.view.ng.html',
                    controller: 'StoreEnvironmentsCtrl as vm'
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), ['admin', 'manager', 'expedition']);
                        });
                    }
                },
                Environments: function($q, toast){
                    return $q(function(resolve, reject) {
                        Meteor.call('Environments.list', { skip: 0, limit: 20 }, function(err, r) {
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
            bodyClass: 'store-environment'
        });
}
