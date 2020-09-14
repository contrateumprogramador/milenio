Package.describe({
  name: 'guima:fuse-core',
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
    // Core
    'core.module.js',

    // Directives
    'directives/ms-navigation/ms-navigation.directive.js',

    // Services
    'services/api-resolver.service.js',
    'services/ms-api.provider.js',
    'services/ms-utils.service.js'
  ],
  'client');
});