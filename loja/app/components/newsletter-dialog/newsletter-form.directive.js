module.exports = function(ngModule) {
    ngModule.directive('newsletterForm', function() {
        return {
            restrict: 'E',
            template: require('./newsletter-form.view.html'),
            replace: true,
            scope: {
                newsletter: '=',
                afterSave: '='
            },
            controllerAs: 'vm',
            controller: function($mdDialog, $rootScope, $scope, Loja, toast) {
                var vm = this;

                // Data
                vm.form = $scope.newsletter;

                // Vars

                // Methods
                vm.newsletterRegister = newsletterRegister;

                // Calls

                // Functions
                function newsletterRegister() {
                    console.log(vm.form)
                    Loja.Auth.newsletterRegister(angular.copy(vm.form)).then(function(){
                        
                    }, function(){
                        toast.message('Você está cadastrado em nossa Newsletter!');
                    });
                }

                function error(err) {
                    toast.message(err.data.message);
                }

                function saved(r) {
                    if ($scope.afterSave)
                        $scope.afterSave();

                    $mdDialog.hide();
                }
            }
        };
    });
};
