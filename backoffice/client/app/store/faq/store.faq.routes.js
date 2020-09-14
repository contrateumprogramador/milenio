'use strict';

angular
    .module('fuseapp')
    .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
        .state('app.store-faq', {
            url: '/loja/faq',
            views: {
                'content@app': {
                    templateUrl: 'client/app/store/faq/store.faq.view.ng.html',
                    controller: 'StoreFaqCtrl as vm'
                }
            },
            resolve: {
                user: function($auth) {
                    return $auth.awaitUser(function(user) {
                        return Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']);
                    });
                },
                CompanyFaqs: function($q, toast){
                    return $q(function(resolve, reject) {
                        Meteor.call('faqsList', function(err, r) {
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
            bodyClass: 'store-faq'
        });
}
