(function() {
    "use strict";

    angular
        .module("fuseapp")
        .controller("AdmOpinionsCtrl", AdmOpinionsCtrl);

    /** @ngInject */
    function AdmOpinionsCtrl(
        $filter,
        $mdDialog,
        $mdSidenav,
        $scope,
        $state,
        $reactive,
        toast,
        List,
        $timeout
    ) {
        var vm = this;

        // Data
        vm.delayTimer = null;
        vm.form = {};
        vm.items = List.items || [];
        vm.total = List.total;
        vm.searchTerm = "";
        vm.selected = vm.items[0] || {};
        vm.pagination = {
            limit: 20,
            page: 1
        };

        vm.order = "avg";

        // Vars

        // Methods
        vm.getList = getList;
        vm.toggleShow = toggleShow;
        vm.select = select;
        vm.sort = sort;
        vm.search = search;

        //////////
        function getList() {
            vm.progressLoading = true;

            const searchTerm = vm.searchTerm.toLowerCase().trim();

            const query = searchTerm.length
                ? {
                    "product.name": {
                        $regex: `^${searchTerm}.*`,
                        $options: "i"
                    }
                } : {};

            const options = {
                skip: (vm.pagination.page - 1) * vm.pagination.limit,
                limit: vm.pagination.limit,
                sort: {
                    [vm.order]: vm.order.charAt(0) == "-" ? -1 : 1
                }
            };

            Meteor.call("Opinions.list", query, options, function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    console.log(r);
                    vm.progressLoading = false;
                    vm.items = r.items;
                    vm.total = r.total;
                    vm.selected = vm.items[0] || {};
                    $scope.$apply();
                }
            });
        }

        function toggleShow(ev, show) {
            var confirm = $mdDialog
                .confirm()
                .title(show ? "Exibir" : "Ocultar")
                .textContent(show ? "Deseja realmente exibir o comentário no site?" : "Deseja ocultar o comentário?")
                .ariaLabel(show ? "Exibir" : "Ocultar")
                .targetEvent(ev)
                .ok(show ? "Exibir" : "Ocultar")
                .cancel("Cancelar");

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;
                Meteor.call("Opinions.toggle", vm.selected._id, show, function(err, r) {
                    vm.progressLoading = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message(show ? "Comentário exibido com sucesso." : "Comentário ocultado.");
                        getList();
                    }
                });
            });
        }

        function search() {
            getList();
        }

        function sort() {
            $timeout(getList, 10);
        }

        /**
         * Select an costumer
         *
         * @param costumer
         */
        function select(item) {
            vm.selected = item;
        }
    }
})();
