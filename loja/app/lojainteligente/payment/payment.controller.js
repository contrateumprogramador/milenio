module.exports = function(LojaInteligenteModule) {
    LojaInteligenteModule.controller("CheckoutPaymentCtrl", function(
        $mdDialog,
        $mdMedia,
        $rootScope,
        $scope,
        $state,
        $timeout,
        $window,
        Loja,
        creditcard,
        lodash,
        Installments,
        CheckoutCustomer,
        toast
    ) {
        // Vars
        var vm = this,
            focused = false;

        vm.checkout = {
            cart: {}
        };

        vm.boletoUrl = "";
        vm.cardLength = 19;
        vm.checkoutCustomer = CheckoutCustomer;
        vm.cancel = cancel;
        vm.checkout.cart.paymentMethod = "Cartão de Crédito";
        vm.cc = creditcard.init("cc");
        vm.document = CheckoutCustomer.document;
        vm.phone = CheckoutCustomer.phone;
        vm.documentMask = "999.999.999-99";
        vm.complete = false;
        vm.errorMessageCC = null;
        vm.errorMessageBoleto = null;
        vm.formStep = 0;
        vm.installments = Installments || [];
        vm.payment = creditcard.init("payment");
        vm.paymentComplete = false;
        vm.payment.installments = vm.installments
            ? vm.installments[vm.installments.length - 1].times
            : 0;
        vm.billetDiscount =
            _.get(Loja.Store.settings(), "billet.discount.value") || false;
        vm.tab = 0;

        console.log(vm.storeSettings);

        // Methods
        vm.brandClass = brandClass;
        vm.cardChange = cardChange;
        vm.changeMethod = changeMethod;
        vm.checkMedia = checkMedia;
        vm.checkoutComplete = checkoutComplete;
        vm.continueDisabled = continueDisabled;
        vm.flip = flip;
        vm.focus = focus;
        vm.goToCart = goToCart;
        vm.inputFocus = inputFocus;
        vm.isFocused = isFocused;
        vm.step = step;
        vm.submit = submit;

        //////////////
        function brandClass(brand) {
            if (!vm.ccForm || !vm.ccForm.ccNumber) return;

            var ccNumber = vm.ccForm.ccNumber.$$rawModelValue;

            if (ccNumber && ccNumber.length >= 4) {
                switch (brand) {
                    case "Visa":
                        return "card-visa";
                    case "MasterCard":
                        return "card-mastercard";
                    case "American Express":
                        return "card-amex";
                    case "Elo":
                    case "Maestro":
                        return "card-elo";
                    case "Diners Club":
                        return "card-diners";
                    case "Discover":
                        return "card-discover";
                }
            } else {
                return;
            }
        }

        function calcInstallments() {
            if (!vm.checkout.cart) return;

            vm.installments = [];

            for (var i = 1; i <= vm.checkout.cart.installmentsMax; i++) {
                vm.installments.push({
                    number: i,
                    value: Math.round((vm.checkout.cart.total / i) * 100) / 100
                });
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function cardChange(field) {
            var input = vm.ccForm[field];

            if (!input) return;

            var v = input.$$rawModelValue;

            switch (field) {
                case "ccNumber":
                    if (v) {
                        vm.cc.number = v;

                        if (v.length >= 6) {
                            if (creditcard.cardIsElo(v)) vm.cc.brand = "Elo";
                            else vm.cc.brand = input.$ccEagerType || "";
                        } else if (v.length < 6) {
                            vm.cc.brand = "";
                        }

                        vm.payment.brand = vm.cc.brand;
                    } else {
                        vm.cc.number = "0000000000000000";
                    }

                    break;
                case "ccValidityMonth":
                    vm.cc.expirationMonth = v || "";
                    break;
                case "ccValidityYear":
                    vm.cc.expirationYear = v ? v.toString().substr(-2) : "";
                    break;
                case "ccCvv":
                    vm.cc.cvv = v;

                    if (v && (v.length < 3 || v.length > 4))
                        input.$setValidity("required", false);
                    break;
            }
        }

        function changeMethod(method) {
            vm.payment.method = method;
        }

        function checkMedia(size) {
            return $mdMedia(size);
        }

        function checkoutComplete() {
            loading(true);
            creditcard.complete(vm.checkout.cart, 50);

            var urlSplited = window.location.href.split("/");
            vm.boletoUrl =
                urlSplited[0] +
                "//" +
                urlSplited[2] +
                "/boleto/" +
                Loja.Checkout.getLastCheckout();
            window.open(vm.boletoUrl);

            return true;
        }

        function continueDisabled() {
            if (!vm.ccForm || !vm.ccForm.ccNumber) return true;

            switch (vm.formStep) {
                case 0:
                    return validateInput("ccNumber");
                case 1:
                    return validateInput("ccName");
                case 2:
                    return (
                        validateInput("ccValidityMonth") ||
                        validateInput("ccValidityYear") ||
                        validateInput("ccCvv")
                    );
            }
        }

        function flip(e) {
            var b = e == "in" ? "FLIP_CARD_IN" : "FLIP_CARD_OUT";

            $rootScope.$broadcast(b);
        }

        function focus(v) {
            focused = v;

            if (v == "cvv") cardChange("ccCvv");
        }

        function goToCart(state) {
            if (Loja.Auth.me()) $state.go("user", { actualOrder: true });
        }

        function inputFocus(name) {
            $timeout(function() {
                angular.element(document.getElementsByName(name)[0]).focus();
            }, 500);
        }
        inputFocus("ccNumber");

        function isFocused(v) {
            return v == focused;
        }

        function loading(v) {
            vm.progressLoading = v;
        }

        function step(i) {
            vm.formStep += i || 1;
            $scope.$apply();
        }

        function submit(method) {
            if (vm.document && vm.phone) {
                Loja.Checkout.setCheckoutDocumentPhone(vm.document, vm.phone);
            }

            loading(true);
            vm.errorMessageCC = null;
            vm.errorMessageBoleto = null;
            vm.formStep = 3;

            if (method == "boleto") {
                vm.payment.method = "Boleto Bradesco";
                vm.payment.installments = 1;
            }

            Loja.Checkout.pay(angular.copy(vm.payment)).then(
                function(r) {
                    loading(false);
                    if (vm.payment.method == "Boleto Bradesco") {
                        vm.boletoUrl = r.data.data.transaction.urlPagamento;
                    } else {
                        toast.message("Pagamento concluído!");
                        if (Loja.Auth.me())
                            $state.go("user", { actualOrder: true });
                        else vm.paymentComplete = true;
                    }
                    vm.payment = [];
                },
                function(err) {
                    if (vm.payment.method == "Boleto Bradesco") {
                        vm.errorMessageBoleto =
                            err.data && err.data.message
                                ? err.data.message
                                : "Erro no sistema, tente novamente.";
                    } else {
                        vm.errorMessageCC =
                            err.data && err.data.message
                                ? err.data.message
                                : "Erro no sistema, tente novamente.";
                    }
                    loading(false);
                    vm.payment = [];
                    vm.cc = creditcard.init("cc");
                    vm.payment = creditcard.init("payment");
                    vm.formStep = 0;
                }
            );

            return;
        }

        function validateInput(name) {
            return (
                vm.ccForm[name].$viewValue.length === 0 ||
                Object.keys(vm.ccForm[name].$error).length
            );
        }
    });
};
