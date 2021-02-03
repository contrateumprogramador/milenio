module.exports = function(ngModule){
    require("./addresses-list.sass");

    ngModule.directive('addressesList', function() {
        return {
            restrict: 'E',
            template: require('./addresses-list.view.html'),
            replace: true,
            scope: {
            	addresses: '=',
                addressDialog: '=',
                addressRemove: '=',
                full: '=',
            	select: '=',
                isSelected: '=',
                internal: '='
            },
            controllerAs: 'vm',
            controller: function($mdDialog, $scope, Loja, toast) {
                var vm = this;

                // Methods
                vm.getAddress = getAddress;
                vm.getSchedule = getSchedule;
                vm.addressDialog = $scope.addressDialog;
                vm.addressRemove = $scope.addressRemove;
                vm.internal = $scope.internal;
                $scope.addresses = (vm.internal) ? [] : $scope.addresses;

                // Functions
                function getAddress(address) {
                    if (address){
                        var r = address.address + ', ' + address.number;

                        if (address.complement)
                            r += ' ' + address.complement;

                        r += ' - ' + address.district;

                        return r;
                    }
                }

                function getSchedule(type, address) {
                    if (address && address.options){
                        var d = address.options[type];

                        return d.day + ', ' + d.time;
                    }
                }
            }
        };
    });
};
