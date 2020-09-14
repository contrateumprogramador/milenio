(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('MailSettingsCtrl', MailSettingsCtrl);

    /** @ngInject */
    function MailSettingsCtrl($mdDialog, $scope, toast, Configurations) {
        var vm = this;

        // Data
        vm.form = Configurations;

        // Vars

        // Methods
        vm.save = save;

        // Functions
        function save() {
            vm.progressLoading = true;
            Meteor.call('editSettings', angular.copy(vm.form), function(err, r) {
                if (err) {
                    vm.progressLoading = false;
                    toast.message(err.reason);
                } else {
                    vm.progressLoading = false;
                    toast.message('Configurações editadas com sucesso');
                }
            });
        };
    }

})();
