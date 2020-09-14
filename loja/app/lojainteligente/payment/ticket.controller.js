module.exports = function(LojaInteligenteModule) {
    LojaInteligenteModule.controller('CheckoutTicketCtrl', function($mdDialog, $mdMedia, $rootScope, $sce, $scope, $state, $timeout, $window, Loja, Ticket, toast) {
        var vm = this;

        // Data
        vm.cart = {};

        // Vars
        vm.boletoUrl = Ticket || '';

        // Methods
        vm.trustSrc = trustSrc;

        // Functions
        function trustSrc(src) {
            return $sce.trustAsResourceUrl(src);
        }
    });
};
