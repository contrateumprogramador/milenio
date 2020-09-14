Package.describe({
    name: 'guima:angulartics',
    version: '1.1.2',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.3.4.1');
    api.use('angular');
    api.addFiles([
        'angulartics.js',
        'angulartics-gtm.js',
        'angulartics-ga.min.js'
    ], 'client');
});
