(function() {
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {

        // State definitions
        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                views: {
                    'main@': {
                        templateUrl: 'client/core/layouts/vertical-navigation-fullwidth-toolbar-2.html',
                        controller: 'MainCtrl as vm'
                    },
                    'toolbar@app': {
                        templateUrl: 'client/toolbar/layouts/vertical-navigation-fullwidth-toolbar-2/toolbar.html',
                        controller: 'ToolbarController as vm'
                    },
                    'navigation@app': {
                        templateUrl: 'client/navigation/layouts/vertical-navigation-fullwidth-toolbar-2/navigation.html',
                        controller: 'NavigationController as vm'
                    },
                    'quickPanel@app': {
                        templateUrl: 'client/quick-panel/quick-panel.html',
                        controller: 'QuickPanelController as vm'
                    }
                }
            });
    }

})();
