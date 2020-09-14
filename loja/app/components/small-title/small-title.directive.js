module.exports = function(ngModule) {
    ngModule.directive('smallTitle', function() {
        return {
            restrict: 'E',
            template: require('./small-title.view.html'),
            replace: true,
            scope: {
                title: '=',
                description: '=',
            },
            controllerAs: 'vm',
            controller: function($mdDialog, $rootScope, $scope, Loja, toast) {
                var vm = this;

            }
        };
    });
};
