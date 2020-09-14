(function ()
{
    'use strict';

    angular
        .module('fuseapp')
        .controller('StoreFaqCtrl', StoreFaqCtrl);

    /** @ngInject */
    function StoreFaqCtrl($mdDialog, $mdSidenav, $scope, $state, $reactive, CompanyFaqs, toast){
        var vm = this;

        // Data
        vm.form = {};
        vm.companyFaqs = CompanyFaqs || {};
        vm.displaying = {};

        // Vars
        vm.dragControlListeners = {
            accept: function (sourceItemHandleScope, destSortableScope) {return true},//override to determine drag is allowed or not. default is true.
            itemMoved: function (event) {console.log('moveu');},
            orderChanged: function(event) {reorder()},
            containment: '#faq-view',
            clone: false, //optional param for clone feature.
            allowDuplicates: false, //optional param allows duplicates to be dropped.
            additionalPlaceholderClass: 'placeholder-drag'
        };

        // Methods
        vm.addButton = add;
        vm.edit = edit;
        vm.getList = getList;
        vm.openForm = openForm;
        vm.remove = remove;
        vm.select = select;
        vm.show = show;
        vm.toggleDetails = toggleDetails;

        //////////

        function add(ev){
            openForm('addFaq', ev);
        }

        function edit(ev, key, faq) {
            faq.key = key;
            vm.selected = faq;
            openForm('editFaq', ev);
        }

        function getList(){
            Meteor.call('faqsList', function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.companyFaqs = r;
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller,
                templateUrl,
                locals;

            switch(action) {
                case 'addFaq':
                case 'editFaq':
                    controller = 'StoreFaqAddCtrl as vm';
                    templateUrl = 'client/app/store/faq/store.faq-add.view.ng.html';
                    locals = (action == 'editFaq') ? { edit: angular.copy(vm.selected)} : {};
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

        function remove(ev, key, faq){
            var confirm = $mdDialog.confirm()
                  .title('Exclusão')
                  .textContent('Deseja excluir a pergunta '+faq.question+'?')
                  .ariaLabel('Exclusão')
                  .targetEvent(ev)
                  .ok('Excluir')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
              Meteor.call('faqRemove', faq, function (err, r){
                vm.loadingProgress = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message('Pergunta excluída.');
                        getList();
                    }
              });
            });
        }

        function reorder(){
            var array = [];
            vm.companyFaqs.forEach(function(faq){
                array.push(faq._id);
            });
            Meteor.call('faqReorder', angular.copy(array), function (err, r){
                vm.loadingProgress = false;

                if (err) {
                    toast.message(err.reason);
                } else {
                    toast.message('Lista reordenada.');
                    getList();
                }
            });
        }

        /**
         * Select an item
         *
         * @param item
         */
        function select(item)
        {
            vm.selected = item;
        }

        function show(show, key){
            vm.displaying[key] = (show) ? 1 : 0;
        }

        /**
         * Toggle details
         *
         * @param item
         */
        function toggleDetails(item)
        {
            vm.selected = item;
            toggleSidenav('details-sidenav');
        }
    }
})();
