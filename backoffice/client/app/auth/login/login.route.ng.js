'use strict';

angular
    .module('fuseapp')
    .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    // State
    $stateProvider.state('app.login', {
        url: '/login',
        views: {
            'main@': {
                templateUrl: 'client/core/layouts/content-only.html',
                controller: 'MainCtrl as vm'
            },
            'content@app.login': {
                templateUrl: 'client/app/auth/login/login.view.ng.html',
                controller: 'LoginController as vm'
            }
        },
        bodyClass: 'login',
        resolve: {
            user: function($q) {
                return (Meteor.userId()) ? $q.reject('LOGGED') : $q.resolve();
            }
        }
    });
}
