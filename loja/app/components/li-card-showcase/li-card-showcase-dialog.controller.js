module.exports = function(ngModule) {
    require('./li-card-showcase.sass');
    ngModule.controller('CardShowcaseDialogCtrl', function($mdDialog, $rootScope,$scope) {
        var vm = this;        

        //Root Scope
        vm.item = $scope.item
        vm.insideDialog = true

        // Methods
        vm.cancel = cancel;

        // Functions
        function cancel(){
          $mdDialog.cancel();
        }

    });
};
