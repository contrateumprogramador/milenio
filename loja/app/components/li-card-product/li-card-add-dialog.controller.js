module.exports = function(ngModule) {
    require('../../product/product.sass');
    ngModule.controller('ProductDialogCtrl', function($mdDialog, $rootScope,$scope) {
        var vm = this;        

        //Root Scope
        $rootScope.pageTitle =  vm.item.name + ' : Milênio Móveis';

        // Methods
        vm.cancel = cancel;

        // Functions
        function cancel(){
          $mdDialog.cancel();
        }

    });
};
