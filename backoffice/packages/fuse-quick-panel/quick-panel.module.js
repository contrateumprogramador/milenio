(function ()
{
    'use strict';

    angular
        .module('app.quick-panel', [])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider, msApiProvider)
    {
        // Translation
        $translatePartialLoaderProvider.addPart('client/quick-panel');

        // Api
        msApiProvider.register('quickPanel.activities', ['client/data/quick-panel/activities.json']);
        msApiProvider.register('quickPanel.contacts', ['client/data/quick-panel/contacts.json']);
        msApiProvider.register('quickPanel.events', ['client/data/quick-panel/events.json']);
        msApiProvider.register('quickPanel.notes', ['client/data/quick-panel/notes.json']);
    }
})();
