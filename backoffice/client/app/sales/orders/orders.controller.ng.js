"use strict";

angular
    .module("fuseapp")
    .controller("OrdersCtrl", function(
        $mdDialog,
        $reactive,
        $scope,
        $state,
        konduto,
        toast
    ) {
        $reactive(this).attach($scope);

        var vm = this;

        vm.status = [];
        getStatus()

        // Data
        vm.selectedDate = new Date();
        vm.selectedMonth = getMonth();

        vm.helpers({
            list: () => Checkouts.find({}),
            payments: () => Payments.find({})
        });

        // Vars
        vm.order = "createdAt";
        vm.progressLoading = false;
        vm.selected = {};
        vm.view = "sales";
        vm.role = Meteor.user().roles[0];
        vm.search = ""
        vm.customer = this.getReactively("customer")

        // Methods
        vm.avatarClass = avatarClass;
        vm.calcTotal = calcTotal;
        vm.cartSelected = cartSelected;
        vm.cartRemove = cartRemove;
        vm.changeMonth = changeMonth;
        vm.changeStatus = changeStatus;
        vm.checkStatus = checkStatus;
        vm.comission = comission;
        vm.configNumber = configNumber;
        vm.customerAvatar = customerAvatar;
        vm.customerName = customerName;
        vm.getDate = getDate;
        vm.getTotal = getTotal;
        vm.getLastPayment = getLastPayment;
        vm.is = is;
        vm.makeDelivery = makeDelivery;
        vm.paymentCancel = paymentCancel;
        vm.paymentCapture = paymentCapture;
        vm.paymentStatus = paymentStatus;
        vm.questions = questions;
        vm.select = select;
        vm.showOrder = showOrder;
        vm.sponsorSellers = sponsorSellers;
        vm.statusPostSelected = statusPostSelected;
        vm.searchName = searchName

        subscribe();

        // Functions
        function getStatus() {
            Meteor.call("statusList", function(err, r) {
                if(!err) vm.status = r[0].status
            });
        }

        function avatarClass(item) {
            switch (item.payment.status) {
                case "Pago":
                    return { "bg-green": true };
                    break;
                case "Transação Já Paga":
                    return { "bg-green": true };
                    break;
                case "Cancelado":
                    return { "bg-grey": true };
                    break;
                case "Pago e Não Capturado":
                    return { "bg-yellow": true };
                    break;
                case "Não Pago":
                    return { "bg-red": true };
                    break;
                case "Aguardando Pagamento":
                    return { "bg-orange": true };
                    break;
                default:
            }
        }

        // Calcula total de cada etapa
        function calcTotal(item, status) {
            vm.total[status] += item.cart.total;
        }

        function cartSelected() {
            vm.cartId = vm.selected[0]._id;
        }

        function cartRemove(ev) {
            var confirm = $mdDialog
                .confirm()
                .parent(angular.element(document.body))
                .title("Remover carrinho?")
                .content(
                    "Remover permantente o " +
                        vm.selected[0].orderNumber +
                        "? Esta ação também removerá o carrinho de suas estatísticas."
                )
                .ariaLabel("Remover carrinho")
                .ok("Remover")
                .cancel("Cancelar")
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;

                Meteor.call("cartRemove", vm.selected[0]._id, function(err, r) {
                    vm.progressLoading = false;

                    if (err) toast.message(err.reason);
                    else toast.message("Carrinho removido.");
                });
            });
        }

        function changeMonth(value) {
            vm.selectedDate = moment(vm.selectedDate).add(value, "month")._d;
            vm.selectedMonth = getMonth();
            vm.cartSubscribe.stop();
            subscribe();
        }

        function getTotal(checkout) {
            const payment = this.getReactively("payments").find(
                payment => payment.checkoutId === checkout._id
            )

            return payment ? payment.transaction.valor / 100 : checkout.cart.total
        }

        function subscribe() {
            vm.searching = true
            if(vm.cartSubscribe) {
                vm.cartSubscribe.stop();
                vm.paymentsSubscribe.stop();
            }

            vm.cartSubscribe = vm.subscribe("sales", function() {
                return [this.getReactively("customer"), vm.selectedDate, vm.search];
            });

            vm.paymentsSubscribe = vm.subscribe("payments", function() {
                return [this.getReactively("list")];
            });

            Tracker.autorun(() => {
                const isReady = vm.cartSubscribe.ready();
                if(isReady) {
                    const currentState = angular.copy(vm.searching);
                    vm.searching = false;
                    if(currentState) $scope.$apply()
                }
            });
        }

        function changeStatus(checkout, key, ev) {
            var confirm = $mdDialog
                .confirm()
                .parent(angular.element(document.body))
                .title("Alterar Status")
                .content(
                    "Confirma a alteração do status para " +
                        vm.status[key].name +
                        "?"
                )
                .ariaLabel("Confirmar")
                .ok("Confirmar")
                .cancel("Voltar")
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;

                Meteor.call(
                    "changeCheckoutStatus",
                    checkout._id,
                    vm.status[key],
                    function(err, r) {
                        if (err) {
                            toast.message(err.reason);
                        } else {
                            toast.message("Pedido atualizado.");
                            select(vm.selected);
                        }
                    }
                );
            });
        }

        function checkStatus(item) {
            var status = "";
            if (item.status) {
                item.status.forEach(function(itemStatus) {
                    if (itemStatus.time) status = itemStatus.name;
                });
            }
            return status;
        }

        function comission(checkout, ev) {
            openForm("comission", ev, checkout);
        }

        function configNumber(item) {
            return item.subnumber
                ? item.orderNumber + " - " + item.subnumber
                : item.orderNumber;
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

        function getDate(item) {
            if (!item) return "";

            if (vm.view == "carts") return item.createdAt;
            else return getLastPayment(item);
        }

        function getLastPayment(item) {
            return item && item.payments
                ? item.payments[item.payments.length - 1].createdAt
                : "";
        }

        function getMonth() {
            var months = [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro"
            ];
            return (
                months[moment(vm.selectedDate).format("MM") - 1] +
                "/" +
                moment(vm.selectedDate).format("YYYY")
            );
        }

        function is(view) {
            return view == vm.view;
        }

        function makeDelivery(checkout, key, ev) {
            Meteor.call("getCheckout", checkout._id, function(err, r) {
                vm.selected = r;
                vm.key = key;
                openForm("delivery", ev);
            });
        }

        function openForm(action, ev, edit) {
            var controller, templateUrl, locals;

            switch (action) {
                case "comission":
                    controller = "ComissionCtrl as vm";
                    templateUrl = "client/app/sales/orders/comission.ng.html";
                    locals = {
                        checkout: edit
                    };
                    break;
                case "delivery":
                    controller = "OrdersDeliveryCtrl as vm";
                    templateUrl =
                        "client/app/sales/orders/orders.delivery.ng.html";
                    locals = {
                        checkout: vm.selected,
                        status: vm.status[vm.key]
                    };
                    break;
                case "show":
                    controller = "OrdersShowCtrl as vm";
                    templateUrl = "client/app/sales/orders/orders.show.ng.html";
                    locals = {
                        checkout: vm.selected,
                        status: vm.status[vm.key]
                    };
                    break;
                case "sellers":
                    controller = "SellersCtrl as vm";
                    templateUrl =
                        "client/app/sales/sellers/sellers.dialog.ng.html";
                    locals = { checkout: vm.selected };
                    break;
                case "questions":
                    controller = "OrdersQuestionsCtrl as vm";
                    templateUrl =
                        "client/app/sales/orders/views/orders.questions.ng.html";
                    locals = {};
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
                    multiple: true,
                    bindToController: true
                })
                .then(function(answer) {
                    toast.message(answer);
                });
        }

        function paymentCancel(item, ev) {
            var confirm = $mdDialog
                .confirm()
                .parent(angular.element(document.body))
                .title("Cancelar pagamento?")
                .content(
                    "Confirma o cancelamento do pagamento da venda " +
                        item.orderNumber +
                        "?"
                )
                .ariaLabel("Cancelar pagamento")
                .ok("Cancelar")
                .cancel("Voltar")
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;

                Meteor.call("paymentCancel", item._id, function(err, r) {
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
                        vm.selected[0].orderNumber +
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

        function paymentStatus(status) {
            switch (status) {
                case 1:
                    return "Pago";
                    break;
                case 2:
                    return "Pago e Não Capturado";
                    break;
                case 3:
                    return "Não Pago";
                    break;
                case 5:
                    return "Transação em Andamento";
                    break;
                case 8:
                    return "Aguardando Pagamento";
                    break;
                case 9:
                    return "Falha na Operadora";
                    break;
                case 13:
                    return "Cancelado";
                    break;
                case 14:
                    return "Estornado";
                    break;
                case 21:
                    return "Boleto Pago a Menor";
                    break;
                case 22:
                    return "Boleto Pago a Maior";
                    break;
                case 23:
                    return "Estrono Parcial";
                    break;
                case 24:
                    return "Estorno Não Autorizado";
                    break;
                case 30:
                    return "Transação em Curso";
                    break;
                case 31:
                    return "Transação Já Paga";
                    break;
                case 40:
                    return "Aguardando Cancelamento";
                    break;
                default:
                    return "Status Indisponível";
                    break;
            }
        }

        function questions(ev) {
            openForm("questions", ev);
        }

        function select(item, key, ev) {
            if (vm.selected._id == item._id) {
                vm.selected = false;
                vm.key = false;
                vm.possibleStatus = [];
            } else {
                vm.selected = item;
                vm.key = key;
                statusPostSelected();
            }
            if (vm.selected) {
                showOrder(ev);
                // Meteor.call('updateCheckoutPayment', vm.selected._id);
            }
        }

        function sponsorSellers(ev, checkout) {
            vm.selected = checkout;
            openForm("sellers", ev);
        }

        function showOrder(ev) {
            if(vm.selected) {
                Meteor.call("getCheckout", vm.selected._id, function(err, r) {
                    vm.selected = r;
                    openForm("show", ev);
                });
            }
        }

        function statusPostSelected() {
            vm.possibleStatus = [];
            var actualStatus = checkStatus(vm.selected);

            if (vm.status && actualStatus != "Pedido Realizado") {
                var stringfied = vm.status.map(function(status) {
                    return status.name;
                });

                stringfied.forEach(function(itemStatus) {
                    if (
                        !itemStatus.time &&
                        stringfied.indexOf(actualStatus) <
                            stringfied.indexOf(itemStatus)
                    )
                        vm.possibleStatus.push(itemStatus);
                });
            }
        }

        function searchName(event, skip) {
            if(skip || !vm.search.length || event.keyCode === 13) {
                subscribe()
                subscribe(true)
            }
        }
    });
