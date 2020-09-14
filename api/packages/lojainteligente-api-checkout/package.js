Package.describe({
  name: 'lojainteligente:api-checkout',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.4.4.2');
    api.use('ecmascript');
    api.use('check');
    api.use('mrest:restivus');
    api.use('zimme:collection-timestampable');
    api.use('alanning:roles');
    api.use('matb33:collection-hooks');
    api.use('momentjs:moment');
    api.use('lojainteligente:api-events');
    api.mainModule('api-checkout.js','server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lojainteligente:api-checkout');
  api.mainModule('api-checkout-tests.js');
});
