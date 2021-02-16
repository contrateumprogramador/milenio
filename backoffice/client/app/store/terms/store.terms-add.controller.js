(function() {
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreTermsAddCtrl', StoreTermsAddCtrl);

    /** @ngInject */
    function StoreTermsAddCtrl($http, $mdDialog, $mdSidenav, $scope, $state, toast) {
        var vm = this;

        // Vars
        vm.form = vm.edit || {};
        vm.progressLoading = false;

        // // Methods
        vm.cancel = cancel;
        vm.save = save;
        vm.setUrl = setUrl;
        vm.typingUrl = typingUrl;

        //Functions

        function cancel(){
            if(!vm.progressLoading && !vm.needSave)
                $mdDialog.cancel();
        }

        //seta a url no campo de url, gerado automaticamente
        function setUrl() {
            vm.form.url = vm.form.name ? configureUrl("name") : "";
        }

        //gera a url a medida que o usuário digita o nome do produto
        function typingUrl() {
            vm.form.url = configureUrl("url");
        }

        //regex para configuração da url digitada
        function configureUrl(type) {
            var title = vm.form[type].replace(/ /g, "-");
            title = Diacritics.remove(title);
            return title.replace(/[^a-z0-9-]/gi, "").toLowerCase();
        }

        function save(){
            var method = (vm.edit) ? 'termsEdit' : 'termsAdd';
            var message = (vm.edit) ? 'Termos editados com sucesso' : 'Termos inseridos com sucesso';
            Meteor.call(method, angular.copy(vm.form), function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.form = {};
                    vm.progressLoading = false;
                    $mdDialog.hide(message);
                }
            });
        }

    }

})();
