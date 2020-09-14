'use strict'

angular.module('fuseapp')
    .controller('AdmSectionsCtrl', function($mdDialog, $mdSidenav, $reactive, $scope, toast, Sections, Tags) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data
        vm.tags = Tags || [];
        vm.sections = Sections || [];
        vm.form = {subSections: []};

        // Vars
        vm.progressLoading = false;
        vm.selected = [];
        vm.displaying = {};

        // Methods
        vm.addButton = add;
        vm.edit = edit;
        vm.remove = remove;
        vm.show = show;

        // Functions
        function add(ev) {
          openForm('add', ev);
        }

        function edit(section, ev){
          vm.selected = angular.copy(section);
          openForm('edit', ev);
        }

        function getList(){
            Meteor.call('sectionsList', function(err, r) {
                vm.progressLoading = false;
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.sections = r;
                    $scope.$apply();
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller,
                templateUrl,
                locals;

            switch(action) {
                case 'add':
                case 'edit':
                    controller = 'AdmSectionsAddCtrl as vm';
                    templateUrl = 'client/app/store/sections/adm.sections.add.view.ng.html';
                    locals = (action == 'edit') ? { edit: angular.copy(vm.selected), tags: vm.tags } : {tags: vm.tags};
                    break;
            }

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

        function remove(ev, section) {
            var confirm = $mdDialog.confirm()
                .title('Excluir')
                .textContent('Confirma exclusão da seção ' + section.name + '?')
                .ariaLabel('Exlcuir')
                .targetEvent(ev)
                .ok('Excluir')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                vm.loadingProgress = true;
                Meteor.call('sectionsRemove', angular.copy(section), function(err, r) {
                    vm.loadingProgress = false;
                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message('Seção excluída.');
                        getList();
                    }
                })
            });
        }

        function show(show, key, tag){
            vm.displaying[key] = (show) ? 1 : 0;
        }

    });
