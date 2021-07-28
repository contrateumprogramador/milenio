"use strict";

angular
    .module("fuseapp")
    .controller("ManipulateCheckout", function (
        $mdDialog,
        $filter,
        $reactive,
        $scope,
        $state,
        konduto,
        toast,
        cep,
        Checkout,
        CheckoutNumber,
        $document
    ) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data
        vm.form = Checkout || {
            cart: {
                discountType: "%",
                items: [],
                installmentsMax: 1
            },
            number: CheckoutNumber || 0
        };
        vm.customers = [];
        vm.items = [];
        vm.total = 0;
        vm.pagination = {
            limit: 10,
            page: 1
        };
        vm.label = {
            page: "Página",
            of: "de"
        };
        vm.role = Meteor.user().roles[0];
        vm.tab = vm.role === "affiliate" ? 0 : 0;

        console.log(vm)
        console.log(vm.role)

        if (Checkout && vm.role !== "affiliate") {
            vm.selected = vm.form.customer;
            vm.addresses = getAddresses(vm.selected._id);
        }

        if (!Checkout && vm.role === "affiliate") {
            vm.form['affiliate'] ={
                firstName:vm.currentUser.profile.firstName,
                lastname:vm.currentUser.profile.lastName,
                affiliateId:vm.currentUser._id
            };

        }

        // if (vm.role == "affiliate")
        //     angular
        //         .element(document.querySelector("md-tabs-wrapper"))
        //         .css("display", "none");

        // Vars

        // Methods
        vm.addToCart = addToCart;
        vm.changePage = changePage;
        vm.getAddress = getAddress;
        vm.getZipcodeAddress = getZipcodeAddress;
        vm.isAddressSelected = isAddressSelected;
        vm.isStatusSelected = isStatusSelected;
        vm.newAddress = newAddress;
        vm.refreshCart = refreshCart;
        vm.removeAddress = removeAddress;
        vm.removeFromCart = removeFromCart;
        vm.saveAddress = saveAddress;
        vm.saveCheckout = saveCheckout;
        vm.saveCustomer = saveCustomer;
        vm.searchCustomers = searchCustomers;
        vm.searchName = searchName;
        vm.select = select;
        vm.selectAddress = selectAddress;
        vm.test = test;


        // Functions
        function addToCart(ev, item) {
            Meteor.call("itemGet", item._id, function (err, completeItem) {
                Meteor.call(
                    "itemCustomizations",
                    completeItem.customizations,
                    function (err, itemCustomizations) {
                        $mdDialog
                            .show({
                                controller: "ProductOptionsCtrl as vm",
                                templateUrl:
                                    "client/app/sales/sellers/product-options.view.ng.html",
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                clickOutsideToClose: false,
                                fullscreen: true,
                                locals: {
                                    item: angular.copy(completeItem),
                                    customizations: itemCustomizations
                                },
                                bindToController: true
                            })
                            .then(function (item) {
                                var count = 0;
                                vm.form.cart.items.forEach(function (cartItem) {
                                    if (compareItems(item, cartItem)) count++;
                                });
                                if (!count) {
                                    item.quant = 1;
                                    item.total = item.options.salesPrice
                                        ? item.options.salesPrice * item.quant
                                        : item.options.price * item.quant;

                                    // valida caso onde cart.items não exista
                                    if (!vm.form.cart.items)
                                        vm.form.cart.items = [];

                                    vm.form.cart.items.unshift(item);
                                    refreshCart();
                                }
                            });
                    }
                );
            });
        }

        function changePage(first) {
            vm.exibedItems = angular
                .copy(vm.searchedItems)
                .splice(
                    vm.pagination.page * vm.pagination.limit - 10,
                    vm.pagination.limit
                );
            if (!first) $scope.$apply();
        }

        function compareItems(item, cartItem) {
            var itemString = item._id + item.options.sku,
                cartItemString = cartItem._id + cartItem.options.sku;

            Object.keys(item.customizations).forEach(function (key) {
                itemString += item.customizations[key].option.code;
            });
            Object.keys(cartItem.customizations).forEach(function (key) {
                cartItemString += cartItem.customizations[key].option.code;
            });

            return itemString == cartItemString;
        }

        function getAddress(address) {
            var r = address.address + ", " + address.number;

            if (address.complement) r += " " + address.complement;

            r += " - " + address.district;

            return r;
        }

        function getAddresses(customerId) {
            Meteor.call("AddressesByCustomer", customerId, function (err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    vm.addresses = r;
                    $scope.$apply();
                }
            });
        }

        function getCustomers() {
            Meteor.call("customersList", function (err, r) {
                err ? toast.message(err.reason) : (vm.customers = r);
            });
        }

        function getZipcodeAddress() {
            if (
                vm.form.shipping != undefined &&
                vm.form.shipping.zipcode != undefined &&
                vm.form.shipping.zipcode.length == 8
            ) {
                vm.progressLoading = true;

                cep.getAddress(angular.copy(vm.form.shipping.zipcode))
                    .success(function (data, status) {
                        vm.progressLoading = false;
                        if (data.erro) {
                            vm.form.shipping.city = "";
                            vm.form.shipping.state = "";
                            vm.form.shipping.address = "";
                            vm.form.shipping.district = "";

                            $scope.shippingForm.zipcode.$setValidity(
                                "cep",
                                false
                            );
                            toast.message(
                                "Não foi possível encontrar o endereço, confira o CEP."
                            );
                        } else {
                            vm.progressLoading = false;
                            vm.form.shipping.city = data.localidade;
                            vm.form.shipping.state = data.uf;
                            vm.form.shipping.address = data.logradouro;
                            vm.form.shipping.district = data.bairro;

                            vm.shippingForm.zipcode.$setValidity("cep", true);
                        }
                    })
                    .error(function (data, status) {
                        vm.progressLoading = false;
                        toast.message(
                            "Não foi possível encontrar o endereço, confira o CEP."
                        );
                    });
            }
        }

        function newAddress() {
            vm.form.shipping = {};
        }

        function calculeDiscount() {
            if (vm.form.cart.discountType == "%")
                return (
                    vm.form.cart.itemsTotal * (vm.form.cart.discount / 100) || 0
                );
            else if (vm.form.cart.discountType == "$")
                return vm.form.cart.discount;
            else return 0;
        }

        function refreshCart() {
            vm.form.cart.itemsCount = 0;
            vm.form.cart.itemsTotal = 0;
            vm.form.cart.items.forEach(function (item) {
                item.total = item.options.salesPrice
                    ? item.options.salesPrice * item.quant
                    : item.options.price * item.quant;
                vm.form.cart.itemsCount += item.quant;
                vm.form.cart.itemsTotal += item.options.salesPrice
                    ? item.options.salesPrice * item.quant
                    : item.options.price * item.quant;
            });
            vm.form.cart.total =
                vm.form.cart.itemsTotal +
                (vm.form.cart.shippingPrice || 0) -
                calculeDiscount();
        }

        function removeAddress(ev) {
            var confirm = $mdDialog
                .confirm()
                .parent(angular.element(document.body))
                .title("Remover endereço?")
                .content("Remover permantente o endereço selecionado?")
                .ariaLabel("Remover endereço")
                .ok("Remover")
                .cancel("Cancelar")
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function () {
                Meteor.call(
                    "addressRemove",
                    angular.copy(vm.form.shipping),
                    function (err, r) {
                        err
                            ? toast.message(err.reason)
                            : toast.message("Endereço excluído.");
                        vm.form.shipping = {};
                        getAddresses(vm.selected._id);
                    }
                );
            });
        }

        function removeFromCart(ev, item) {
            vm.form.cart.items.splice(item, 1);
            refreshCart();
        }

        function saveAddress() {
            var message = vm.form.shipping._id
                ? "Endereço atualizado."
                : "Endereço incluído.";
            Meteor.call(
                "addressRegister",
                vm.selected._id,
                angular.copy(vm.form.shipping),
                function (err, r) {
                    err ? toast.message(err.reason) : toast.message(message);
                    getAddresses(vm.selected._id);
                }
            );
        }

        function saveCheckout() {
            var edit = Checkout ? true : false;
            var message = Checkout
                ? "Carrinho Editado."
                : "Carrinho adicionado.";
            Meteor.call(
                "internalManipulateCheckout",
                angular.copy(vm.form),
                edit,
                function (err, r) {
                    err ? toast.message(err.reason) : toast.message(message);
                    $state.go("app.funnel");
                }
            );
        }

        function saveCustomer() {
            var message = vm.form.customer._id
                ? "Cliente atualizado."
                : "Cliente incluído.";
            var edit = vm.form.customer._id ? true : false;
            Meteor.call(
                "customerRegister",
                angular.copy(vm.form.customer),
                edit,
                function (err, r) {
                    err ? toast.message(err.reason) : toast.message(message);
                    getCustomers();
                    select(r);
                }
            );
        }

        function searchCustomers(searchText) {
            if (searchText.length > 3) {
                vm.progressLoading = true;
                Meteor.call(
                    "searchCustomers",
                    configureString(searchText),
                    "firstname",
                    function (err, r) {
                        vm.customers = r;
                        vm.exibedCustomers = r;
                        vm.progressLoading = false;
                        $scope.$apply();
                    }
                );
            } else {
                vm.customers = [];
                vm.exibedCustomers = [];
            }
        }

        // configura a string de busca
        function configureString(search) {
            return search.toLowerCase().trim();
        }

        function searchName() {
            if (vm.search.length > 3) {
                vm.progressLoading = true;
                if (vm.items.length == 0) {
                    Meteor.call(
                        "searchItems",
                        configureString(vm.search),
                        function (err, r) {
                            vm.items = r;
                            vm.total = r.length;
                            vm.searchedItems = r;
                            vm.progressLoading = false;
                            changePage();
                        }
                    );
                } else {
                    vm.searchedItems = $filter("filter")(
                        angular.copy(vm.items),
                        {name_nd: configureString(vm.search)}
                    );
                    vm.progressLoading = false;
                    vm.total = vm.searchedItems.length;
                    changePage();
                }
            } else {
                vm.items = [];
                vm.searchedItems = [];
                vm.exibedItems = [];
                vm.total = 0;
                vm.pagination = {
                    limit: 10,
                    page: 1
                };
            }
        }

        function configureString(search) {
            return Diacritics.remove(search.toLowerCase()).trim();
        }

        /**
         * Select an costumer
         *
         * @param costumer
         */
        function select(costumer) {
            vm.selected = costumer;
            vm.form.customer = vm.selected;
            vm.form.shipping = {};

            if (vm.form.customer._id)
                vm.addresses = getAddresses(vm.selected._id);
        }

        function selectAddress(address) {
            vm.form.shipping = address;
        }

        function isAddressSelected(address) {
            return vm.form.shipping._id == address._id;
        }

        function isStatusSelected(status) {
            return vm.form.status[0].name == status.name;
        }

        function test() {
            console.log("rodou");
        }
    });
