'use strict'

angular.module('fuseapp')
    .controller('AdmSectionsAddCtrl', function($mdDialog, $mdSidenav, $reactive, $scope, toast) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data
        vm.form = vm.edit || {subSections: []};

        // Vars
        vm.progressLoading = false;

        // Methods
        vm.cancel = cancel;
        vm.querySearch = querySearch;
        vm.save = save;
        vm.setUrl = setUrl;
        vm.typingUrl = typingUrl;

        // Functions
        function cancel(){
          $mdDialog.cancel();
        }

        function save() {
            var method = (vm.edit) ? 'sectionsEdit' : 'sectionsAdd',
                message = (vm.edit) ? 'Seção Editada.' : 'Seção adicionada.';
            vm.progressLoading = true;
            vm.form.name_nd = Diacritics.remove(vm.form.name).toLowerCase();
            Meteor.call(method, angular.copy(vm.form), function(err, r) {
                vm.progressLoading = false;
                (err) ? toast.message(err.reason) : $mdDialog.hide(message);
            });
        }

        function configureUrl(type){
            var tag = vm.form[type].replace(/ /g,"-");
            tag = Diacritics.remove(tag);
            return tag.replace(/[^a-z0-9-]/gi,'').toLowerCase();
        }

        function setUrl() {
            vm.form.url = (vm.form.name) ? configureUrl('name') : "";
        }

        function typingUrl(){
            vm.form.url = configureUrl('url');
        }

        //realiza a query de busca para um determinado md-chips
        function querySearch(query, local) {
            var results = query ? vm[local].filter(createFilterFor(query, local)) : [];
            return results;
        }

        function createFilterFor(query, local) {
            var lowercaseQuery = Diacritics.remove(angular.lowercase(query));

            return function filterFn(variable) {
                return angular.lowercase(variable.name).match(lowercaseQuery);
            };

        }

        function tagsConfig(){
            var newTags = [];
            vm.tags.forEach(function(group){
                group.tags.forEach(function(tag){
                    newTags.push({
                        name: tag.name,
                        url: tag.url,
                        tagsGroup: group.name
                    });
                });
            });
            vm.tags = newTags;
        }

        tagsConfig();

    });
