module.exports = function(ngModule){
    ngModule.controller('AddressesListCtrl', function($scope) {
        var vm = this;

        // Vars

        // Methods
        vm.getAddress = getAddress;
        vm.getSchedule = getSchedule;

        // Functions
        function getAddress(address) {
            var r = address.address + ', ' + address.number;

            if (address.complement)
                r += ' ' + address.complement;

            r += ' - ' + address.district;

            return r;
        }

        function getSchedule(type, address) {
            var d = address.options[type];

            return d.day + ', ' + d.time;
        }

    });
};
