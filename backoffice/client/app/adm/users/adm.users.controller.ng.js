'use strict'

angular.module('fuseapp')
    .controller('AdmUsersCtrl', function($mdDialog, $scope, toast, UsersList) {
        var vm = this;

        // Header
        vm.addButton = add;

        // Data
        vm.users = UsersList;
        vm.selected = [vm.users[0]] || {};

        // Methods
        vm.edit = edit;
        vm.remove = remove;
        vm.selectedUser = selectedUser;
        vm.userRole = userRole;

        // Functions
        function add(ev) {
            openForm('add', ev);
        }

        function edit(ev) {
            openForm('edit', ev);
        }

        function getList() {
            vm.progressLoading = true;

            Meteor.call('usersList', function(err, r) {
                vm.progressLoading = false;
                if (err) {
                    toast.message('Erro ao listar usuários.');
                } else {
                    vm.users = r;
                    vm.selected = [r[0]] || false;
                    $scope.$apply();
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller = 'AdmUsersAddCtrl as vm',
                templateUrl = 'client/app/adm/users/adm.users-add.view.ng.html',
                locals = (action == 'edit') ? { edit: angular.copy(vm.selected[0]) } : {};

            $mdDialog.show({
                    controller: controller,
                    templateUrl: templateUrl,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    locals: locals,
                    bindToController: true
                })
                .then(function(answer) {
                    getList();

                    toast.message(answer);
                });
        }

        function remove(ev) {
            var confirm = $mdDialog.confirm()
                .title('Exclusão')
                .textContent('Deseja excluir permanentemente o usuário ' + vm.selected[0].profile.firstname + ' ' + vm.selected[0].profile.lastname + '?')
                .ariaLabel('Exclusão')
                .targetEvent(ev)
                .ok('Excluir')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                Meteor.call('userRemove', vm.selected[0]._id, function(err, r) {
                    vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        getList();
                        toast.message('Usuário excluído.');
                    }
                });
            });
        }

        function selectedUser(){
            return vm.selected[0]._id != Meteor.userId();
        }

        function userRole(user) {
            switch (user.roles[0]) {
                case 'super-admin':
                    return 'Super Administrador';
                break;
                case 'admin':
                    return 'Administrador';
                break;
                case 'api':
                    return 'API';
                break;
                case 'salesman':
                    return 'Vendedor';
                break;
                case 'maintenance':
                    return 'Manutenção';
                break;
                case 'expedition':
                    return 'Expedição';
                break;                
            }
        };
    });
