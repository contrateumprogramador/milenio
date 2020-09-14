'use strict'

angular.module('fuseapp')
    .controller('AdmTagsCtrl', function($mdDialog, $mdSidenav, $reactive, $scope, toast, TagsGroups) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data
        vm.tagsGroups = TagsGroups || [];

        // Vars
        vm.dragControlListeners = {
            accept: function (sourceItemHandleScope, destSortableScope) {return true},//override to determine drag is allowed or not. default is true.
            itemMoved: function (event) {console.log('moveu');},
            orderChanged: function(event) {reorder(event)},
            containment: '#cardView',
            clone: false, //optional param for clone feature.
            allowDuplicates: false, //optional param allows duplicates to be dropped.
            additionalPlaceholderClass: 'placeholder-drag'
        };

        // Vars
        vm.progressLoading = false;
        vm.selected = [];
        vm.displaying = {};
        vm.tagsGroup = (vm.tagsGroups.length > 0) ? vm.tagsGroups[0] : null;


        // Methods
        vm.changeType = changeType;
        vm.remove = remove;
        vm.removeTagsGroup = removeTagsGroup;
        vm.tagAdd = tagAdd;
        vm.tagsGroupAdd = tagsGroupAdd;
        vm.typingUrl = typingUrl;
        vm.toggleSelect = toggleSelect;
        vm.toggleSelectTags = toggleSelectTags;
        vm.setUrl = setUrl;
        vm.show = show;


        // Functions

        function changeType(tagsGroup, key) {
            vm.tagsGroup = tagsGroup;
            vm.groupKey = key;
        }

        function getList(method, id){
            Meteor.call(method, id || null, function(err, r) {
                vm.progressLoading = false;

                if (err) {
                    toast.message(err.reason);
                } else {
                    (method == "tagsGroupList") ? vm.tagsGroups = r : vm.tagsGroup = r; vm.tagsGroups[vm.groupKey] = vm.tagsGroup;
                    $scope.$apply();
                }
            });
        }

        function tagAdd() {
            vm.progressLoading = true;

            if(vm.tagsGroup){
                vm.form.tag_nd = Diacritics.remove(vm.form.tag).toLowerCase();
                Meteor.call('tagAdd', angular.copy(vm.form), vm.tagsGroup, function(err, r) {
                    vm.progressLoading = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message('Tag adicionada.');

                        var oldForm = vm.form;

                        vm.form = {
                            tagsGroup: vm.tagsGroups[0].name || {},
                            category: oldForm.category
                        };

                        getList('tagsGroupById', vm.tagsGroup._id);
                    }
                });
            } else {
                vm.progressLoading = false;
                toast.message('Selecione ou crie um Grupo de Tags');
            }
        }

        function tagsGroupAdd() {
            vm.progressLoading = true;

            Meteor.call('tagsGroupAdd', vm.form.tagGroup, Diacritics.remove(vm.form.tagGroup).toLowerCase(), function(err, r) {
                vm.progressLoading = false;

                if (err) {
                  toast.message(err.reason);
                } else {
                  toast.message('Grupo de tags adicionado.')
                  vm.form.tagGroup = '';
                  getList('tagsGroupList');
                }
            });
        }

        function setUrl() {
            vm.form.url = (vm.form.tag) ? configureUrl('tag') : "";
        }

        function typingUrl(){
            vm.form.url = configureUrl('url');
        }

        function configureUrl(type){
            var tag = vm.form[type].replace(/ /g,"-");
            tag = Diacritics.remove(tag);
            return tag.replace(/[^a-z0-9-]/gi,'').toLowerCase();
        }

        function remove(ev, tag) {
            vm.selected = tag;
            var confirm = $mdDialog.confirm()
                .title('Excluir')
                .textContent('Confirma exclusão da tag ' + vm.selected.name + '?')
                .ariaLabel('Exlcuir')
                .targetEvent(ev)
                .ok('Excluir')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                vm.loadingProgress = true;
                Meteor.call('tagsRemove', angular.copy(vm.selected), angular.copy(vm.tagsGroup), function(err, r) {
                    vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message('Tags excluídas.');
                        getList('tagsGroupById', vm.tagsGroup._id);
                    }
                })
            });
        }

        function removeTagsGroup(tagsGroup, ev) {
            var confirm = $mdDialog.confirm()
                .title('Excluir')
                .textContent('Confirma exclusão do grupo ' + tagsGroup.name + '?')
                .ariaLabel('Exlcuir')
                .targetEvent(ev)
                .ok('Excluir')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                vm.loadingProgress = true;
                Meteor.call('tagsGroupRemove', tagsGroup, function(err, r) {
                    vm.loadingProgress = false;

                    if (err) {
                      toast.message(err.reason);
                    } else {
                      toast.message('Grupo excluído.');
                      getList('tagsGroupList');
                    }
                })
            });
        }

        function reorder(event){
            Meteor.call('tagsReorder', angular.copy(vm.tagsGroup), function(err, r) {
                vm.loadingProgress = false;
                (err) ? toast.message(err.reason) : toast.message('Tags Reordenadas.');
            })
        }

        function show(show, key, tag){
            vm.displaying[key] = (show) ? 1 : 0;
            if(tag)
                (tag.itemsCount > 0) ? vm.cantDelete = true : vm.cantDelete = false;
        }

        /**
         * Toggle select threads
         */
        function toggleSelectTags() {
            if (vm.selected.length > 0) {
                deselectTags();
            } else {
                selectTags();
            }
        }

        function toggleSelect(tag) {
            if (vm.selected.indexOf(tag) > -1) {
                vm.selected.splice(vm.selected.indexOf(tag), 1);

                vm.cantDelete = (vm.selected.length == 0) ? false : true;

                vm.selected.forEach(function(tag){
                    if(tag.itemsCount > 0){
                        vm.cantDelete = true;
                        return;
                    }
                    vm.cantDelete = false;
                });
            } else {
                vm.selected.push(tag);
                if(tag.itemsCount > 0)
                    vm.cantDelete = true;
            }
        }

        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

    });
