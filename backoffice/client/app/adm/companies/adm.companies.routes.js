'use strict';

angular
    .module('fuseapp')
    .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
        .state('app.adm-companies', {
            url: '/adm/empresas',
            views: {
                'content@app': {
                    templateUrl: 'client/app/adm/companies/adm.companies.view.ng.html',
                    controller: 'AdmCompaniesController as vm'
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), 'super-admin');
                        });
                    }
                },
                CompaniesList: function($q, toast) {
                    return $q(function(resolve, reject) {
                        Meteor.call('companiesList', function(err, r) {
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
            bodyClass: 'adm-companies'
        });
}
