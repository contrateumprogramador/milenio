angular.module('fuseapp', [
    'angular-meteor',
    'angular-meteor.auth',
    'ui.router',
    'ngMaterial',
    'ngAnimate',
    'angularUtils.directives.dirPagination',
    'accounts.ui',
    'fuse',
    'uiGmapgoogle-maps',
    'nvd3',
    'ui.utils.masks',
    'idf.br-filters',
    'ngCompareTo',
    'ngLocale',
    'md.data.table',
    'ngDropzone',
    'as.sortable',
    'textAngular',
    'infinite-scroll'
]);

onReady = function() {
    angular.bootstrap(document, ['fuseapp']);
};

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}
