module.exports = function(ngModule) {
    require('./policies.sass');
    ngModule.controller('PoliciesCtrl', function($document, $filter, $mdDialog, $rootScope, $scope, $state, $mdMedia, Loja, toast, Policies) {
        var vm = this;

        //Var
        vm.policies = Policies || [];

    });
};
