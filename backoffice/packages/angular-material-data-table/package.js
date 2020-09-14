Package.describe({
  name: 'guima:angular-material-data-table',
  version: '1.0.4',
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
  api.addFiles('angular-material-data-table.js', 'client');
  api.addAssets([
        'angular-material-data-table.css',
    ], 'client');
});