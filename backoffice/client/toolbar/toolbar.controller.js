(function() {
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($state, toast) {
        var vm = this;

        // Methods
        vm.logout = logout;


        // Functions
        function logout() {
            Meteor.logout(function(err, r) {
                if (err) {
                    toast.message('Erro ao sair, tente novamente.');
                } else {
                    $state.go('app.login');
                }
            });
        }
    }

})();
