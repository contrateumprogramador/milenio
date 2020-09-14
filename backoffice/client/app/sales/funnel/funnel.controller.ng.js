"use strict";

angular
    .module("fuseapp")
    .controller("FunnelCtrl", function(
        $rootScope,
        $mdDialog,
        $reactive,
        $scope,
        $state,
        konduto,
        toast
    ) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data
        vm.funnel = [
            {
                name: "Carrinho Iniciado",
                icon: "icon-cart-outline",
                offset: 0,
                limit: 10,
                total: 0,
                sub: null
            },
            {
                name: "Endereço Informado",
                offset: 0,
                icon: "icon-truck",
                limit: 10,
                total: 0,
                sub: null
            },
            {
                name: "Pagamento Iniciado",
                offset: 0,
                icon: "icon-credit-card",
                limit: 10,
                total: 0,
                sub: null
            },
            {
                name: "Ganho",
                offset: 0,
                icon: "icon-checkbox-marked-circle",
                limit: 10,
                total: 0,
                sub: null
            }
        ];
        subscribe(true);

        vm.subscribe("payment", function() {
            return [this.getReactively("cartId")];
        });

        vm.helpers({
            list: () => Checkouts.find({}),
            payment: () => Payments.find({})
        });

        // Vars
        vm.cartId = null;
        vm.fraudStatus = null;
        vm.fraudStatusList = konduto.statusList();
        vm.progressLoading = false;
        vm.selected = false;
        vm.view = "carts";
        vm.role = Meteor.user().roles[0];

        // Methods
        vm.affiliateSend = affiliateSend;
        vm.calcTotal = calcTotal;
        vm.cartLink = cartLink;
        vm.cartSelected = cartSelected;
        vm.cartRemove = cartRemove;
        vm.checkKonduto = checkKonduto;
        vm.configNumber = configNumber;
        vm.customerAvatar = customerAvatar;
        vm.customerName = customerName;
        vm.editCheckout = editCheckout;
        vm.fraudLink = fraudLink;
        vm.fraudRecommendation = fraudRecommendation;
        vm.fraudStatusClose = fraudStatusClose;
        vm.fraudStatusOpen = fraudStatusOpen;
        vm.fraudUpdate = fraudUpdate;
        vm.getDate = getDate;
        vm.getLastPayment = getLastPayment;
        vm.is = is;
        vm.itemIsInColumn = itemIsInColumn;
        vm.paymentCancel = paymentCancel;
        vm.paymentCapture = paymentCapture;
        vm.sale = sale;
        vm.scrollDown = scrollDown;
        vm.select = select;
        vm.sendMail = sendMail;
        vm.sponsorSellers = sponsorSellers;

        function affiliateSend(checkout, ev) {
            var confirm = $mdDialog
                .confirm()
                .parent(angular.element(document.body))
                .title("Enviar para o cliente")
                .content(
                    `Deseja enviar o orçamento ${checkout.number} para ${
                        checkout.customer.firstname
                    } ${checkout.customer.lastname}?`
                )
                .ariaLabel("Enviar orçamento")
                .ok("Enviar")
                .cancel("Cancelar")
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;

                Meteor.call("emailAffiliateToCustomer", checkout, function(
                    err,
                    r
                ) {
                    vm.progressLoading = false;
                    if (err) toast.message(err.reason);
                    else toast.message("E-mail enviado para o cliente.");
                });
            });
        }

        function sale(checkout) {
            Meteor.call("checkoutUpdate", checkout._id, function(err, r) {
                vm.progressLoading = false;

                if (err) toast.message(err.reason);
                else toast.message("Atualizado.");
            });
        }

        // Functions
        // Calcula total de cada etapa
        function calcTotal(item, status) {
            vm.total[status] += item.cart.total;
        }

        function cartLink(checkout, view) {
            if (!$rootScope.company) return;

            if (view)
                return `${$rootScope.company.website}/orcamento/${
                    checkout.number
                }/${checkout.code}?view=true`;

            return `${$rootScope.company.website}/?affiliateId=${
                $rootScope.currentUser._id
            }&customerId=${checkout.customer.customerId}&checkoutId=${
                checkout._id
            }`;
        }

        function cartSelected() {
            vm.cartId = vm.selected[0]._id;
        }

        function cartRemove(cart, ev) {
            var confirm = $mdDialog
                .confirm()
                .parent(angular.element(document.body))
                .title("Remover carrinho?")
                .content(
                    "Remover permantente o " +
                        cart.number +
                        "? Esta ação também removerá o carrinho de suas estatísticas."
                )
                .ariaLabel("Remover carrinho")
                .ok("Remover")
                .cancel("Cancelar")
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;

                Meteor.call("cartRemove", cart._id, function(err, r) {
                    vm.progressLoading = false;

                    if (err) toast.message(err.reason);
                    else toast.message("Carrinho removido.");
                });
            });
        }

        function checkKonduto() {
            return vm.payment.length && vm.payment[0].konduto;
        }

        function configNumber(item) {
            return item.subnumber
                ? item.number + " - " + item.subnumber
                : item.number;
        }

        // Retorna iniciais do Customer
        function customerAvatar(item) {
            if (!item.customer || !item.customer.firstname) return "?";

            var r = item.customer.firstname.substr(0, 1);

            if (item.customer.lastname)
                r +=
                    item.customer.lastname.indexOf(" ") > -1
                        ? item.customer.lastname.substr(
                              item.customer.lastname.lastIndexOf(" "),
                              1
                          )
                        : item.customer.lastname.substr(0, 1);

            return r.toUpperCase();
        }

        // Retorna nome do Customer
        function customerName(item) {
            if (!item.customer || !item.customer.firstname)
                return "Não identificado";

            var r = item.customer.firstname;
            r += item.customer.lastname ? " " + item.customer.lastname : "";

            return r;
        }

        function editCheckout(ev, checkoutId) {
            $state.go("app.funnel.manipulate", {
                checkoutId: checkoutId || vm.selected._id
            });
        }

        function fraudLink() {
            return checkKonduto() ? konduto.link(vm.payment[0].konduto) : "";
        }

        function fraudRecommendation() {
            return checkKonduto()
                ? konduto.recommendation(vm.payment[0].konduto)
                : "";
        }

        function fraudStatusClose() {
            var fraud = vm.payment[0].konduto;

            if (fraud.order.status != vm.fraudStatus) {
                var confirm = $mdDialog
                    .confirm()
                    .parent(angular.element(document.body))
                    .title("Alterar Status Antifraude?")
                    .content(
                        'Confirma alteração do Status Antifraude para "' +
                            konduto.status(fraud).toUpperCase() +
                            '" neste pedido?'
                    )
                    .ariaLabel("Confirmar alteração de Status do Antifraude")
                    .ok("Alterar")
                    .cancel("Cancelar");

                $mdDialog.show(confirm).then(function() {
                    vm.progressLoading = true;

                    Meteor.call(
                        "kondutoPut",
                        angular.copy(vm.payment[0]),
                        function(err, r) {
                            vm.progressLoading = false;

                            if (err)
                                toast.message(
                                    "Erro ao alterar Status do Antifraude."
                                );
                            else
                                toast.message("Status do Antifraude alterado.");
                        }
                    );
                });
            }
        }

        function fraudStatusOpen() {
            vm.fraudStatus = vm.payment[0].konduto.order.status;
        }

        function fraudUpdate() {
            Meteor.call(
                "paymentUpdateKonduto",
                angular.copy(vm.payment[0]._id),
                function(err, r) {
                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message("Status Konduto atualizado.");
                    }
                }
            );
        }

        function getDate(item) {
            if (!item) return "";

            if (vm.view == "carts") return item.createdAt;
            else return getLastPayment(item);
        }

        function getLastPayment(item) {
            return item && item.payments && item.payments.length
                ? item.payments[item.payments.length - 1].createdAt
                : "";
        }

        function is(view) {
            return view == vm.view;
        }

        function itemIsInColumn(status, column) {
            status =
                status == "Checkout Iniciado" ? "Carrinho Iniciado" : status;

            return status == column;
        }

        function openForm(action, ev, edit) {
            var controller, templateUrl, locals;

            switch (action) {
                case "sellers":
                    controller = "SellersCtrl as vm";
                    templateUrl =
                        "client/app/sales/sellers/sellers.dialog.ng.html";
                    locals = { checkout: vm.selected };
                    break;
                case "sendMail":
                    controller = "MailCtrl as vm";
                    templateUrl =
                        "client/app/sales/sellers/mail.dialog.ng.html";
                    locals = { checkout: vm.selected };
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
                    toast.message(answer);
                });
        }

        function paymentCancel(ev) {
            var confirm = $mdDialog
                .confirm()
                .parent(angular.element(document.body))
                .title("Cancelar pagamento?")
                .content(
                    "Confirma o cancelamento do pagamento da venda " +
                        vm.selected[0].number +
                        "?"
                )
                .ariaLabel("Cancelar pagamento")
                .ok("Cancelar")
                .cancel("Voltar")
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;

                Meteor.call("paymentCancel", vm.payment[0]._id, function(
                    err,
                    r
                ) {
                    vm.progressLoading = false;

                    if (err) toast.message(err.reason);
                    else toast.message("Pagamento cancelado.");
                });
            });
        }

        function paymentCapture(ev) {
            var confirm = $mdDialog
                .confirm()
                .parent(angular.element(document.body))
                .title("Capturar pagamento?")
                .content(
                    "Confirma do pagamento da venda " +
                        vm.selected[0].number +
                        "?"
                )
                .ariaLabel("Capturar pagamento")
                .ok("Capturar")
                .cancel("Cancelar")
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;

                Meteor.call("paymentCapture", vm.payment[0]._id, function(
                    err,
                    r
                ) {
                    vm.progressLoading = false;

                    if (err) toast.message(err.reason);
                    else toast.message("Pagamento capturado.");
                });
            });
        }

        function scrollDown(column) {
            column.limit += 10;
            subscribe(false, column);
        }

        function select(item, key, ev) {
            if (vm.selected._id == item._id) {
                vm.selected = false;
                vm.key = false;
            } else {
                vm.selected = item;
                vm.key = key;
            }
        }

        function sendMail(ev) {
            Meteor.call("getCheckout", vm.selected._id, function(err, r) {
                console.log(r);
                vm.selected = r;
                openForm("sendMail", ev);
            });
        }

        function subscribe(add, unique) {
            if (add) {
                vm.funnel.forEach(function(column) {
                    column.sub = vm.subscribe("carts", function() {
                        return [
                            this.getReactively("customer"),
                            column.name,
                            column.offset,
                            column.limit
                        ];
                    });
                });
            } else if (!unique) {
                vm.funnel.forEach(function(column) {
                    column.sub.stop();
                });
            } else {
                unique.sub.stop();
                unique.sub = vm.subscribe("carts", function() {
                    return [
                        this.getReactively("customer"),
                        unique.name,
                        unique.offset,
                        unique.limit
                    ];
                });
            }
        }

        function sponsorSellers(ev, checkout) {
            vm.selected = angular.copy(checkout);
            openForm("sellers", ev);
        }

        $scope.$watch(
            function() {
                return vm.list;
            },
            function(newValue, oldValue, scope) {}
        );
    });
