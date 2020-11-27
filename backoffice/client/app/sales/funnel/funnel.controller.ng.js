"use strict";

angular
    .module("fuseapp")
    .controller("FunnelCtrl", function(
        $rootScope,
        $mdDialog,
        $reactive,
        $scope,
        $state,
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

        vm.helpers({
            list: () => Checkouts.find({}),
        });

        // Vars
        vm.cartId = null;
        vm.progressLoading = false;
        vm.selected = false;
        vm.view = "carts";
        vm.role = Meteor.user().roles[0];
        vm.search = ""

        // Methods
        vm.affiliateSend = affiliateSend;
        vm.calcTotal = calcTotal;
        vm.cartLink = cartLink;
        vm.cartSelected = cartSelected;
        vm.cartRemove = cartRemove;
        vm.configNumber = configNumber;
        vm.customerAvatar = customerAvatar;
        vm.customerName = customerName;
        vm.editCheckout = editCheckout;
        vm.getDate = getDate;
        vm.is = is;
        vm.itemIsInColumn = itemIsInColumn;
        vm.sale = sale;
        vm.scrollDown = scrollDown;
        vm.select = select;
        vm.sendMail = sendMail;
        vm.sponsorSellers = sponsorSellers;
        vm.searchName = searchName

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

        function getDate(item) {
            if (!item) return "";

            if (vm.view == "carts") return item.createdAt;
            else return getLastPayment(item);
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

        function searchName() {
            console.log(vm.search)
        }

        $scope.$watch(
            function() { return vm.list; },
            function(newValue, oldValue, scope) {}
        );
    });
