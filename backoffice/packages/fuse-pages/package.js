Package.describe({
  name: 'guima:fuse-pages',
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
    // Pages
    'pages.module.js',

    // Auth
    'auth/forgot-password/forgot-password.module.js',
    'auth/lock/lock.module.js',
    'auth/login/login.module.js',
    'auth/login-v2/login-v2.module.js',
    'auth/register/register.module.js',
    'auth/register-v2/register-v2.module.js',
    'auth/reset-password/reset-password.module.js',

    // Coming Soon
    'coming-soon/coming-soon.module.js',

    // Errors
    'errors/404/error-404.module.js',
    'errors/500/error-500.module.js',

    // Invoice
    'invoice/invoice.module.js',

    // Maintenance
    'maintenance/maintenance.module.js',

    // Profile
    'profile/profile.module.js',

    // Search
    'search/search.module.js',

    // Timeline
    'timeline/timeline.module.js'
  ],
  'client');
});
