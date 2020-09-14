module.exports = function(ngModule) {
    ngModule.directive('ordersList', function() {
        return {
            restrict: 'E',
            template: require('./orders-list.view.html'),
            replace: true,
            scope: {
                orders: '=',
                full: '=',
                select: '=',
                isSelectedOrder: '='
            },
            controllerAs: 'vm',
            controller: function($mdDialog, $rootScope, $scope, Loja, toast) {
                var vm = this;

                vm.orders = $scope.orders;
            }
        };
    });
};
