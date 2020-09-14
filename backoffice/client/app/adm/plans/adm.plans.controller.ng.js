'use strict'

angular.module('fuseapp')
    .controller('AdmPlansCtrl', function($mdDialog, $scope, toast, PlansList) {
        var vm = this;

        // Header
        vm.addButton = add;

        // Data
        vm.plans = PlansList;

        // Methods
        vm.edit = edit;
        vm.remove = remove;

        // Functions
        function add(ev) {
            openForm('add', ev);
        }

        function edit(ev, plan) {
            vm.selected = plan;
            openForm('edit', ev);
        }

        function getList() {
            vm.progressLoading = true;

            Meteor.call('plansList', function(err, r) {
                vm.progressLoading = false;
                if (err) {
                    toast.message('Erro ao listar planos.');
                } else {
                    vm.plans = r;
                    $scope.$apply();
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller = 'AdmPlansAddCtrl as vm',
                templateUrl = 'client/app/adm/plans/adm.plans-add.view.ng.html',
                locals = (action == 'edit') ? { edit: angular.copy(vm.selected) } : {};

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

        function remove(ev, plan) {
            var confirm = $mdDialog.confirm()
                .title('Exclusão')
                .textContent('Deseja excluir permanentemente o plano ' + plan.name + '?')
                .ariaLabel('Exclusão')
                .targetEvent(ev)
                .ok('Excluir')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                Meteor.call('planRemove', plan, function(err, r) {
                    vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        getList();
                        toast.message('Plano excluído.');
                    }
                });
            });
        }
    });
