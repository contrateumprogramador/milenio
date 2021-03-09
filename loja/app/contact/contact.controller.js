module.exports = function(ngModule){
    require('./contact.sass');
    ngModule.controller('ContactCtrl', function($document, $rootScope, $mdDialog, $mdSidenav, $scope, $state, $timeout, Loja, toast) {
        var ctrl = $scope.$parent.$parent.ctrl,
            layout = $scope.$parent.layout,
            vm = this;

        // Ctrl
        $rootScope.pageTitle = 'Contato : Milênio Móveis';

        // Data

        // Vars
        vm.segments = [
          "Construtoras e Incorporadoras", 
          "Hotéis e Pousadas", 
          "Arquitetura e Decoração", 
          "Cliente Final", 
          "Outros"
        ]

        // Methods
        vm.sendContact = sendContact;

        // Functions
        function sendContact(){
          vm.loading = true;
          Loja.Email.contact(angular.copy(vm.form)).then(function(r){
            vm.form = {};
            vm.loading = false;
            toast.message('Contato enviado com sucesso.');
          }, function(err){
            vm.loading = false;
            toast.message(err.data.message);
          });
        }

    });
};
