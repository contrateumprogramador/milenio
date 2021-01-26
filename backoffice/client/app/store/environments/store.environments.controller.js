(function ()
{
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreEnvironmentsCtrl', StoreEnvironmentsCtrl);

    /** @ngInject */
    function StoreEnvironmentsCtrl($mdDialog, $mdSidenav, $scope, $state, $reactive, Environments, toast){
        var vm = this;

        // Data
        vm.form = {};
        vm.selected = null;
        vm.environments = Environments.environments || [];
        vm.exibedEnvironments = Environments.environments || [];
        vm.searchedEnvironments = []
        vm.total = Environments.total || 0
        vm.displaying = {};
        vm.label = {
            page: "Página",
            of: "de"
        };
        vm.search = {
            name: "",
            tags: []
        };
        vm.pagination = {
            limit: 10,
            skip: 0,
            page: 1
        };
        vm.role = Meteor.user().roles[0];

        // Methods
        vm.addButton = add;
        vm.edit = edit;
        vm.getList = getList;
        vm.openForm = openForm;
        vm.remove = remove;
        vm.searchName = searchName

        //////////
        function add(ev){
            openForm('addEnv', ev);
        }

        function edit(ev, env) {
            vm.selected = env;
            console.log(vm.selected)
            openForm('editEnv', ev);
        }

        // configura a string de busca
        function configureString(search) {
            return search.toLowerCase().trim();
        }

        function cleanEnvs(){
            vm.searchedEnvironments = [];
            vm.exibedEnvironments = [];
            vm.pagination = {
                limit: 10,
                skip: 0,
                page: 1
            };
        }

        function searchName(){
            if(vm.search.name.length > 3){
                vm.progressLoading = true;
                Meteor.call('Environments.search', configureString(vm.search.name), function(err, r){
                    vm.total = r.length;
                    vm.searchedEnvironments = r;
                    vm.exibedEnvironments = r;
                    vm.progressLoading = false;
                    getList();
                });
            } else {
                cleanEnvs();
                getList();
            }
        }

        function getList(){
            vm.pagination = {
                skip: vm.pagination.page*vm.pagination.limit-10,
                limit: vm.pagination.limit,
                page: vm.pagination.page
            };

            if(vm.searchedEnvironments.length){
                vm.exibedEnvironments = angular.copy(vm.searchedEnvironments).splice(
                    vm.pagination.page*vm.pagination.limit-10,
                    vm.pagination.limit
                );

                $scope.$apply();
            } else {
                Meteor.call('Environments.list', vm.pagination, function(err, r){
                    vm.exibedEnvironments = r.environments;
                    vm.total = r.total;

                    $scope.$apply();
                });
            }
        }

        function openForm(action, ev) {
            var controller,
                templateUrl,
                locals;

            switch(action) {
                case 'addEnv':
                case 'editEnv':
                    controller = 'StoreEnvironmentsAddCtrl as vm';
                    templateUrl = 'client/app/store/environments/store.environments-add.view.ng.html';
                    locals = (action == 'editEnv') ? { edit: angular.copy(vm.selected)} : {};
                    break;
            }

            Meteor.call("Affiliate.list", (err, r) => {
                locals.affiliates = r.items

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
            })
        }

        function remove(ev, env){
            var confirm = $mdDialog.confirm()
                  .title('Exclusão')
                  .textContent('Deseja excluir o ambiente '+env.name+'?')
                  .ariaLabel('Exclusão')
                  .targetEvent(ev)
                  .ok('Excluir')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
              Meteor.call('Environments.remove', env, function (err, r){
                vm.loadingProgress = false;
                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message('Ambiente excluído.');
                        getList();
                    }
              });
            });
        }
    }
})();
