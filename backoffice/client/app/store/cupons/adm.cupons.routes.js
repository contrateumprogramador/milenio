'use strict';

angular
    .module('fuseapp')
    .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
        .state('app.store-cupons', {
            url: '/loja/cupons',
            views: {
                'content@app': {
                    templateUrl: 'client/app/store/cupons/adm.cupons.view.ng.html',
                    controller: 'AdmCuponsCtrl as vm'
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), 'admin');
                        });
                    }
                },
                CuponsList: function($q, toast){
                    return $q(function(resolve, reject) {
                        Meteor.call('cuponsList', function(err, r) {
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
            bodyClass: 'store-cupons'
        });
}
