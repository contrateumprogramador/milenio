(function ()
{
    'use strict';

    angular
        .module('app.dashboards', [
            'app.dashboards.project',
            'app.dashboards.server',
            'app.dashboards.analytics'
        ])
        .config(config);

    /** @ngInject */
    function config()
    {
        
    }

})();