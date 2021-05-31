module.exports = function (ngModule) {
    require("./user.sass");
    require("./steps.css");
    ngModule.controller("UserCtrl", function (
        $document,
        $rootScope,
        $stateParams,
        $mdDialog,
        $mdBottomSheet,
        $mdSidenav,
        $scope,
        $state,
        $timeout,
        Addresses,
        Carts,
        Customer,
        Loja,
        Orders,
        toast
    ) {
        var ctrl = $scope.$parent.ctrl,
            layout = $scope.$parent.layout,
            vm = this;

        $rootScope.title = {
            title: "Área do Cliente"
        };

        vm.actual = $scope.$resolve.$stateParams.actual;
        vm.actualOrder = $scope.$resolve.$stateParams.actualOrder;

        // Ctrl
        $rootScope.pageTitle = "Área do Cliente : Milênio Móveis";

        // Data
        vm.addresses = Addresses.data.data || [];
        vm.orders = Orders || [];
        vm.carts = Carts || [];
        vm.icons = [];

        vm.customer = Customer || {}; // Dados do Customer
        vm.onlyEmail = vm.customer.username.split(":"); //Separa o email do dominio
        vm.customer.username = vm.onlyEmail[0]; //Seta só o email no campo de email

        vm.customerBK = {};

        if (!$rootScope.goTo) $rootScope.goTo = "pedidos";

        // Vars
        vm.address = false;
        vm.card = $rootScope.goTo;
        vm.customerEditing = false; // Modo de edição
        vm.documentMask =
            vm.customer.profile.document.length > 11
                ? "99.999.999/9999-99"
                : "999.999.999-99"; // Mascara de CPF/CNPJ
        vm.orderClicked = vm.orders[0] || false; // Pedido selecionado
        vm.status = null;
        vm.icons = [
            "correct-symbol.png",
            "credit-card.png",
            "producing.png",
            "receipt.png",
            "nfe.png",
            "delivery.png",
            "home.png"
        ];
        vm.isOpen = false;
        vm.local = "orders";
        vm.menuItems = [
            {name: "Meus Dados", icon: "icon-account-box", url: "dados"},
            {
                name: "Meus Endereços",
                icon: "icon-map-marker-circle",
                url: "enderecos"
            },
            {name: "Meus Pedidos", icon: "icon-wallet-travel", url: "pedidos"}
        ];

        vm.menu = {
            dados: {
                icon: "icon-account-box",
                title: "Meus dados"
            },
            enderecos: {
                icon: "icon-map-marker-circle",
                title: "Meus endereços"
            },
            pedidos: {
                icon: "icon-basket",
                title: "Meus pedidos"
            }
            // cupons: {
            //     icon: 'icon-ticket',
            //     title: 'Cupons de desconto'
            // }
        };

        $scope.disabled = "true";

        // Methods
        vm.addressDialog = addressDialog;
        vm.addressRemove = addressRemove;
        vm.addressSelect = addressSelect;
        vm.addressSelected = addressSelected;
        vm.customerEdit = customerEdit;
        vm.orderSelected = orderSelected;
        vm.editPassword = editPassword;
        vm.finishOrder = finishOrder;
        vm.goTo = goTo;
        vm.goToItemClicked = goToItemClicked;
        vm.goToTicket = goToTicket;
        vm.hoverIn = hoverIn;
        vm.openMenu = openMenu;
        vm.openOrders = openOrders;
        vm.orderSelect = orderSelect;
        vm.showTicket = showTicket;
        vm.tabChange = tabChange;
        vm.opinionDialog = opinionDialog;

        $scope.$watch(
            function () {
                return $rootScope.goTo;
            },
            function (newValue, oldValue, scope) {
                vm.card = newValue;
            }
        );

        // Functions
        // Adiciona novo Address
        function addressDialog(method, ev) {
            var address = angular.copy(vm.address);

            $mdDialog
                .show({
                    controller: function ($mdDialog) {
                        var ctrl = this;

                        if (method == "edit") ctrl.address = address;

                        if (method == "add")
                            ctrl.address = {
                                title: "",
                                address: "",
                                number: "",
                                complement: "",
                                district: "",
                                zipcode: "",
                                city: "",
                                state: "",
                                options: {
                                    collect: {
                                        day: "",
                                        time: ""
                                    },
                                    delivery: {
                                        day: "",
                                        time: ""
                                    }
                                },
                                obs: ""
                            };

                        ctrl.cancel = function () {
                            $mdDialog.cancel();
                        };
                    },
                    controllerAs: "vm",
                    template: require("../components/addressForm/address-form.dialog.html"),
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true
                })
                .then(function (answer) {
                    addressesGet();
                });
        }

        // Atualiza Adresses
        function addressesGet() {
            Loja.Customer.addresses().then(
                function (r) {
                    vm.addresses = r.data.data;
                },
                function (err) {
                    toast.message(err.data.message);
                }
            );
        }

        // Remove Address
        function addressRemove(ev) {
            var confirm = $mdDialog
                .confirm()
                .title("Excluir endereço?")
                .textContent(
                    "Confirma a exclusão do endereço " + vm.address.title + "?"
                )
                .ariaLabel("Excluir endereço?")
                .targetEvent(ev)
                .ok("Excluir")
                .cancel("Cancelar");

            $mdDialog.show(confirm).then(
                function () {
                    Loja.Customer.addressDelete(vm.address._id).then(
                        function () {
                            toast.message("Endereço excluído.");
                            addressesGet();
                        },
                        function (err) {
                            toast.message(err.data.message);
                        }
                    );
                },
                function () {
                    $scope.status = "You decided to keep your debt.";
                }
            );
        }

        // Seleciona Address
        function addressSelect(address) {
            if (vm.address._id == address._id) vm.address = false;
            else vm.address = angular.copy(address);
        }

        // Confere se Adress está selecionado
        function addressSelected(address) {
            return vm.address._id == address._id;
        }

        function opinionDialog(ev, productId) {
            $mdDialog.show({
                controller: function ($mdDialog, Loja) {
                    var ctrl = this;

                    ctrl.form = {
                        costBenefit: 1,
                        quality: 1,
                        characteristics: 1,
                        productId
                    }

                    //Methods
                    ctrl.cancel = cancel;
                    ctrl.select = select;
                    ctrl.starFilled = starFilled;
                    ctrl.submit = submit;

                    //Functions
                    function cancel() {
                        $mdDialog.cancel();
                    };

                    function select(index, key) {
                        ctrl.form[key] = index + 1
                    }

                    function starFilled(index, key) {
                        return (index + 1) <= ctrl.form[key]
                    }

                    function submit() {
                        Loja.Adm.opinionCreate(ctrl.form).then((r) => {
                            $mdDialog.hide("Opinião registrada com sucesso");
                        })
                    }
                },
                controllerAs: 'ctrl',
                template: require('../components/li-opinions/li-opinions-dialog.view.html'),
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true
            })
                .then(function (answer) {
                    toast.message(answer)
                });
        }

        // Toggle do modo de edição do Customer
        function customerEdit(method) {
            switch (method) {
                case "cancel":
                    // Recupera dados originais do Customer
                    vm.custorderomer = angular.copy(vm.customerBK);
                    // Desabilita modo de edição
                    vm.customerEditing = false;
                    break;
                case "save":
                    // Atualiza dados do Customer
                    Loja.Auth.customerUpdate(angular.copy(vm.customer)).then(
                        function () {
                            toast.message("Seus dados foram atualizados.");
                            vm.customerEditing = false;
                        },
                        function (err) {
                            toast.message(err.message);
                        }
                    );
                    break;
                case "start":
                    // Armazena dados originais do Customer
                    vm.customerBK = angular.copy(vm.customer);
                    // Habilita modo de edição
                    vm.customerEditing = true;
                    // Foca campo de nome
                    //angular.element('input[name=firstname]').focus();
                    angular
                        .element(document.getElementsByName("firstname"))
                        .focus();
                    break;
            }
        }

        // Alterar Senha
        function editPassword(method, ev) {
            $mdDialog
                .show({
                    controller: function ($mdDialog) {
                        var ctrl = this;

                        // Methods
                        ctrl.changePassword = changePassword;

                        //Var
                        ctrl.loading = false;

                        function changePassword() {
                            loadingStart();
                            Loja.Auth.passwordChange(
                                ctrl.form.oldPass,
                                ctrl.form.newPass
                            ).then(
                                function (r) {
                                    toast.message(r.data.data.message);
                                    ctrl.form = [];
                                    $mdDialog.cancel();
                                    loadingStart();
                                },
                                function (err) {
                                    toast.message("Senha Antiga Incorreta!");
                                    loadingStart();
                                }
                            );
                        }

                        if (method == "edit") ctrl.address = address;

                        ctrl.cancel = function () {
                            $mdDialog.cancel();
                        };

                        function loadingStart() {
                            if (!ctrl.loading) ctrl.loading = true;
                            else ctrl.loading = false;
                        }
                    },
                    controllerAs: "ctrl",
                    template: require("../components/passwordChange/password-change-dialog.view.html"),
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true
                })
                .then(function (answer) {
                    addressesGet();
                });
        }

        function finishOrder() {
            Loja.Checkout.setCheckout(vm.orderClicked);
            $state.go("cart");
            $mdDialog.cancel();
        }

        //Formata Endereço
        function getAddress(address) {
            var r = address.address + ", " + address.number;

            if (address.complement) r += " " + address.complement;

            r += " - " + address.district;

            return r;
        }

        //Formata Coleta e Entrega
        function getSchedule(type, address) {
            var d = address.options[type];

            return d.day + ", " + d.time;
        }

        // Muda State
        function goTo(card) {
            $state.go("user.card", {
                card: card
            });
            vm.card = card;
        }

        function goToItemClicked(url) {
            vm.card = url;
        }

        function goToTicket() {
            $state.go("ticket", {checkoutId: vm.orderClicked._id});
            if (!ctrl.checkMedia("gt-sm")) $mdDialog.cancel();
        }

        function hoverIn(value) {
            vm.status = value;

            if (value === undefined || value === null) {
                angular.forEach(vm.orderClicked.status, function (v, k) {
                    if (v.time) {
                        vm.status = k;
                    }
                });
            }
        }

        hoverIn();

        // Abrir Menu
        function openMenu($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        }

        // Abrir Dialog de Pedidos
        function openOrders(ev, orderClicked) {
            $mdDialog.show({
                controller: function ($mdDialog, $scope) {
                    var ctrlOrder = this;

                    ctrlOrder.finishOrder = vm.finishOrder;
                    ctrlOrder.showTicket = vm.showTicket;
                    ctrlOrder.goToTicket = vm.goToTicket;

                    //Methods
                    ctrlOrder.hoverIn = hoverIn;

                    //Vars
                    ctrlOrder.status = null;
                    ctrlOrder.icons = vm.icons;
                    ctrlOrder.orderClicked = orderClicked;
                    ctrlOrder.icons = [
                        "correct-symbol.png",
                        "credit-card.png",
                        "producing.png",
                        "receipt.png",
                        "nfe.png",
                        "delivery.png",
                        "home.png"
                    ];

                    function hoverIn(value) {
                        ctrlOrder.status = value;
                        if (value === null) {
                        }
                    }

                    hoverIn();

                    ctrlOrder.cancel = function () {
                        $mdDialog.cancel();
                    };
                },
                controllerAs: "ctrlOrder",
                template: require("../components/ordersList/order-list.dialog.html"),
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true
            });
        }

        if (vm.actual) {
            setTimeout(function () {
                vm.tabSelected = 1; // TAB GERAL
                vm.indexTabOrders = 1; // TAB PEDIDOS OU ORÇAMENTOS
                orderSelect(vm.carts[vm.carts.length - 1]);
                $scope.$apply();
            }, 1000);
        }

        if (vm.actualOrder) {
            setTimeout(function () {
                vm.tabSelected = 1; // TAB GERA
                vm.indexTabOrders = 0; // TAB PEDIDOS OU ORÇAMENTOS
                orderSelect(vm.orders[vm.orders.length - 1]);
                $scope.$apply();
            }, 1000);
        }

        function orderSelect(order) {
            if (!vm.first) {
                vm.orderClicked = false;
                vm.first = true;
            } else if (
                vm.orderClicked._id == order._id &&
                ctrl.checkMedia("gt-md")
            ) {
                vm.orderClicked = false;
            } else {
                vm.orderClicked = angular.copy(order);
                hoverIn(null);
            }
        }

        // Confere se Order está selecionado
        function orderSelected(order) {
            return vm.orderClicked._id == order._id;
        }

        function showTicket() {
            return (
                vm.orderClicked.orderNumber &&
                vm.orderClicked.ticketUrl &&
                !vm.orderClicked.status[1].time
            );
        }

        function tabChange(local) {
            vm.local = local;
            vm.orderClicked = false;
        }

        $timeout(function () {
            angular
                .element(document.querySelector(".orders-list button"))
                .triggerHandler("click");
        });
    });
};
