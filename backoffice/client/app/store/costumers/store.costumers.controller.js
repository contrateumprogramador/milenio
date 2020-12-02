(function() {
    "use strict";

    angular
        .module("fuseapp")
        .controller("StoreCustomersCtrl", StoreCustomersCtrl);

    /** @ngInject */
    function StoreCustomersCtrl(
        $filter,
        $mdDialog,
        $mdSidenav,
        $rootScope,
        $scope,
        $state,
        $reactive,
        toast,
        CustomersList
    ) {
        var vm = this;

        // Data
        vm.delayTimer = null;
        vm.form = {};
        vm.exibedCustomers = CustomersList.customers || [];
        vm.total = CustomersList.total;
        vm.selected = vm.exibedCustomers[0] || {};
        getAddresses(vm.selected._id);
        vm.pagination = {
            limit: 10,
            page: 1
        };
        vm.label = {
            page: "Página",
            of: "de"
        };
        vm.order = "-createdAt";
        vm.customers = [];

        // Vars

        // Methods
        vm.add = add;
        vm.edit = edit;
        vm.cartLink = cartLink;
        vm.cartList = cartList;
        vm.changePage = changePage;
        vm.openForm = openForm;
        vm.orderList = orderList;
        vm.remove = remove;
        vm.searchName = searchName;
        vm.select = select;
        vm.toggleDetails = toggleDetails;

        //////////

        function add(ev) {
            openForm("addCostumer", ev);
        }

        function addAddress(ev) {
            openForm("addAddress", ev);
        }

        function cartLink(customer) {
            if (!$rootScope.company) return;

            return `${$rootScope.company.website}/?affiliateId=${
                $rootScope.currentUser._id
            }&customerId=${customer._id}`;
        }

        function cartList(ev) {
            openForm("cartList", ev);
        }

        function changePage() {
            vm.progressLoading = true;
            Meteor.call(
                "customersList",
                false,
                vm.pagination.page * vm.pagination.limit - 10,
                vm.pagination.limit,
                function(err, r) {
                    vm.exibedCustomers = r.customers;
                    vm.progressLoading = false;
                    $scope.$apply();
                }
            );
        }

        function edit(ev) {
            openForm("editCostumer", ev);
        }

        function getAddresses(customerId) {
            if (Roles.userIsInRole(Meteor.userId(), "affiliate")) return;

            Meteor.call("AddressesByCustomer", customerId, function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.addresses = r;
                    $scope.$apply();
                }
            });
        }

        function openForm(action, ev, edit) {
            var controller, templateUrl, locals;

            switch (action) {
                case "addCostumer":
                case "editCostumer":
                    controller = "StoreCostumersAddCtrl as vm";
                    templateUrl =
                        "client/app/store/costumers/store.costumers-add.view.ng.html";
                    locals =
                        action == "editCostumer"
                            ? { edit: angular.copy(vm.selected) }
                            : {};
                    break;
                case "addAddress":
                    controller = "StoreAddressAddCtrl as vm";
                    templateUrl =
                        "client/app/store/customers/store.address-add.view.ng.html";
                    locals = {};
                    break;
                case "cartList":
                    controller = "FunnelCtrl as vm";
                    templateUrl = "client/app/sales/funnel/funnel.view.ng.html";
                    locals = { customer: vm.selected };
                    break;
                case "orderList":
                    controller = "OrdersCtrl as vm";
                    templateUrl = "client/app/sales/orders/orders.view.ng.html";
                    locals = { customer: vm.selected };
                    break;
            }

            $mdDialog
                .show({
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
                    changePage(true);
                    toast.message(answer);
                });
        }

        function orderList(ev) {
            openForm("orderList", ev);
        }

        function remove(ev) {
            var confirm = $mdDialog
                .confirm()
                .title("Exclusão")
                .textContent(
                    "Deseja excluir o cliente " + vm.selected.firstname + "?"
                )
                .ariaLabel("Exclusão")
                .targetEvent(ev)
                .ok("Excluir")
                .cancel("Cancelar");

            $mdDialog.show(confirm).then(function() {
                Meteor.call("customerRemove", vm.selected._id, function(
                    err,
                    r
                ) {
                    vm.progressLoading = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message("Cliente excluído.");
                        changePage(true);
                    }
                });
            });
        }

        // busca um cliente pelo nome
        function searchName() {
            if (vm.search.length > 3) {
                vm.progressLoading = true;
                Meteor.call(
                    "searchCustomers",
                    configureString(vm.search),
                    "firstname",
                    function(err, r) {
                        vm.total = r.length;
                        vm.searchedCustomers = vm.customers = vm.exibedCustomers = r;
                        vm.progressLoading = false;
                        $scope.$apply();
                    }
                );
            } else {
                vm.customers = [];
                vm.searchedCustomers = [];
                vm.exibedCustomers = CustomersList.customers || [];
                vm.total = CustomersList.total;
                vm.pagination = {
                    limit: 10,
                    page: 1
                };
            }
        }

        // configura a string de busca
        function configureString(search) {
            return search.toLowerCase().trim();
        }

        /**
         * Select an costumer
         *
         * @param costumer
         */
        function select(costumer) {
            vm.selected = costumer;
            vm.addresses = getAddresses(vm.selected._id);
        }

        /**
         * Toggle details
         *
         * @param costumer
         */
        function toggleDetails(costumer) {
            vm.selected = costumer;
            toggleSidenav("details-sidenav");
        }
    }
})();
