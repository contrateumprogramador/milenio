(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.login-v2', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_login-v2', {
            url      : '/pages/auth/login-v2',
            views    : {
                'main@'                          : {
                    templateUrl: 'client/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_login-v2': {
                    templateUrl: 'client/main/pages/auth/login-v2/login-v2.html',
                    controller : 'LoginV2Controller as vm'
                }
            },
            bodyClass: 'login-v2'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('client/main/pages/auth/login-v2');

        // Navigation
        msNavigationServiceProvider.saveItem('pages.auth.login-v2', {
            title : 'Login v2',
            state : 'app.pages_auth_login-v2',
            weight: 2
        });
    }

})();