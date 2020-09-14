Package.describe({
    name: 'guima:fuse-components',
    version: '1.0.0',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.3.2.4');
    api.use('angular');


    api.add_files([
            // Components
            'components.module.js',

            // Cards
            'cards/cards.module.js',

            
            // Charts
            // C3
            'charts/c3/c3.module.js',

            // Chart-js
            'charts/chart-js/chart-js.module.js',

            // Chartist
            'charts/chartist/chartist.module.js',

            // Nvd3
            'charts/nvd3/nvd3.module.js',
            'charts/nvd3/nvd3.controller.js',
            'charts/nvd3/nvd3.html',

            
            // Maps
            'maps/maps.module.js',


            // Price Tables
            'price-tables/price-tables.module.js',


            // Tables
            // Datatable
            'tables/datatable/datatable.module.js',

            // Simple Table
            'tables/simple-table/simple-table.module.js',


            // Widgets
            'widgets/widgets.module.js'
        ],
        'client');

    api.addAssets([
        // Charts
        'charts/charts.scss',
        ], 'client')
});
