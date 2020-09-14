module.exports = function(ngModule) {
    require('./milenio-title.sass');

    ngModule.directive('milenioTitle', function() {
        return {
            restrict: 'E',
            template: require('./milenio-title.view.html'),
            replace: true,
            scope: {
                titleText: '=',
                description: '='
            },
            controllerAs: 'vm',
            controller: function($mdDialog, $rootScope, $scope, Loja, toast) {
                var vm = this;

                // Vars
                vm.titleText = $scope.titleText;
                
                //Methods
                vm.checkMedia = $scope.$parent.$parent.ctrl.checkMedia;
            }
        };
    });
};
