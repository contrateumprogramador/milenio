(function ()
{
    'use strict';

    angular
        .module('app.pages.invoice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_invoice', {
            url      : '/pages/invoice',
            views    : {
                'content@app': {
                    templateUrl: 'client/main/pages/invoice/invoice.html',
                    controller : 'InvoiceController as vm'
                }
            },
            resolve  : {
                Invoice: function (msApi)
                {
                    return msApi.resolve('invoice@get');
                }
            },
            bodyClass: 'invoice printable'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('client/main/pages/invoice');

        // Api
        msApiProvider.register('invoice', ['client/data/invoice/invoice.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('pages.invoice', {
            title : 'Invoice',
            icon  : 'icon-receipt',
            state : 'app.pages_invoice',
            weight: 4
        });
    }

})();