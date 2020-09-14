(function() {
    "use strict";

    angular
        .module("fuseapp")
        .controller("AdmAffiliatesAddCtrl", StoreCostumersAddCtrl);

    /** @ngInject */
    function StoreCostumersAddCtrl($mdDialog, toast) {
        var vm = this;

        // Vars
        vm.form = vm.edit ? vm.edit.profile : { comissions: { rate: 10 } };
        vm.progressLoading = false;

        if (vm.edit) {
            console.log(vm.edit);
            vm.form._id = vm.edit._id;
            vm.form.email = vm.edit.emails[0].address;
        }

        // // Methods
        vm.cancel = cancel;
        vm.save = save;

        //Functions

        function cancel() {
            if (!vm.progressLoading) $mdDialog.cancel();
        }

        function save() {
            vm.progressLoading = true;

            Meteor.call(
                vm.edit ? "Affiliate.update" : "Affiliate.insert",
                angular.copy(vm.form),
                function(err, r) {
                    if (err) {
                        toast.message(err.reason);
                    } else {
                        vm.form = {};
                        vm.progressLoading = false;
                        $mdDialog.hide(
                            vm.edit
                                ? "Decorador editado com sucesso"
                                : "Decorador inserido com sucesso"
                        );
                    }
                }
            );
        }
    }
})();
