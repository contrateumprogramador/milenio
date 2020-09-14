module.exports = function(ngModule){
    require('./about.sass');
    // require('./steps.css');
    ngModule.controller('AboutCtrl', function($document, $rootScope, $mdDialog, $mdSidenav, $scope, $state, $timeout, toast, Banners) {
        var ctrl = $scope.$parent.$parent.ctrl,
            layout = $scope.$parent.layout,
            vm = this;


        // Ctrl
        $rootScope.pageTitle = 'Sobre : Milênio Móveis';

        // Data
        vm.banners = Banners;
        vm.title = "Realizamos o sonho de nossos clientes com móveis exclusivos, feitos sob medida.";

        // Vars

        // Methods
        vm.dialog = dialog;

        // Functions
        function dialog(param1, param2){

        }

    });
};
