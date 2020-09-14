'use strict'

angular.module('fuseapp')
    .controller('OrdersShowCtrl', function($mdDialog, $reactive, $scope, $state, konduto, toast) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data

        // Vars
        vm.fraudStatusList = konduto.statusList();
        vm.fraudStatus = null;
        vm.payment = getPayment();
        vm.valuesDivided = false;

        // Methods
        vm.cancel = cancel;
        vm.changeStatus = changeStatus;
        vm.checkKonduto = checkKonduto;
        vm.fraudLink = fraudLink;
        vm.fraudRecommendation = fraudRecommendation;
        vm.fraudStatusClose = fraudStatusClose;
        vm.fraudStatusOpen = fraudStatusOpen;
        vm.fraudUpdate = fraudUpdate;
        vm.getPaymentValue = getPaymentValue;
        vm.paymentStatus = paymentStatus;
        vm.updateKonduto = updateKonduto;

        // Functions
        function cancel(argument) {
            $mdDialog.cancel();
        }

        function changeStatus(){
            Meteor.call('changeCheckoutStatus', vm.checkout._id, vm.status, function(err, r){
                if (err) {
                    toast.message(err.reason);
                } else {
                    $mdDialog.hide('Status alterado com sucesso.');
                }
            });
        }

        function checkKonduto() {
            return (vm.payment.length && vm.payment.konduto);
        }

        function hoverIn(value){
            vm.hover = value;

            if (value === undefined || value === null){
                angular.forEach(vm.checkout.status, function(v, k){
                    if (v.time){
                        vm.hover = k;
                    }
                });
            }
        }

        function fraudLink() {
            return (checkKonduto()) ? konduto.link(vm.payment.konduto) : '';
        }

        function fraudRecommendation() {
            return (checkKonduto()) ? konduto.recommendation(vm.payment.konduto) : '';
        }

        function fraudStatusClose() {
            var fraud = vm.payment.konduto;

            if (fraud.order.status != vm.fraudStatus) {
                vm.progressLoading = true;

                Meteor.call('kondutoPut', angular.copy(vm.payment), function(err, r) {
                    vm.progressLoading = false;

                    if (err)
                        toast.message('Erro ao alterar Status do Antifraude.');
                    else
                        toast.message('Status do Antifraude alterado.');
                });
            }
        };

        function fraudStatusOpen() {
            vm.fraudStatus = vm.payment.konduto.order.status;
        };

        function fraudUpdate() {
            Meteor.call('paymentUpdateKonduto', angular.copy(vm.payment._id), function(err, r) {
                if (err) {
                    toast.message(err.reason);
                } else {
                    toast.message('Status Konduto atualizado.');
                }
            });
        }

        function getPayment(){
            Meteor.call('getPayment', vm.checkout._id, function(err, r){
                (err) ? toast.message(err.reason) : vm.payment = r;
            });
        }

        function getPaymentValue(){
            if(vm.payment && !vm.valuesDivided){
                vm.payment.transaction.valor /= 100;
                vm.payment.transaction.valorDesconto /= 100;
                vm.payment.mensagemVenda = paymentStatus(vm.payment.statusTransacao);
                vm.valuesDivided = true;
            }
        }

        function paymentStatus(status) {
            switch(status) {
                case 1:
                    return 'Pago';
                    break;
                case 2:
                    return 'Pago e Não Capturado';
                    break;
                case 3:
                    return 'Não Pago';
                    break;
                case 5:
                    return 'Transação em Andamento';
                    break;
                case 8:
                    return 'Aguardando Pagamento';
                    break;
                case 9:
                    return 'Falha na Operadora';
                    break;
                case 13:
                    return 'Cancelado';
                    break;
                case 14:
                    return 'Estornado';
                    break;
                case 21:
                    return 'Boleto Pago a Menor';
                    break;
                case 22:
                    return 'Boleto Pago a Maior';
                    break;
                case 23:
                    return 'Estrono Parcial';
                    break;
                case 24:
                    return 'Estorno Não Autorizado';
                    break;
                case 30:
                    return 'Transação em Curso';
                    break;
                case 31:
                    return 'Transação Já Paga';
                    break;
                case 40:
                    return 'Aguardando Cancelamento';
                    break;
                default:
                    return 'Status Indisponível';
                    break;
            }
        }

        function updateKonduto(){
            Meteor.call('sendKondutoManually', angular.copy(vm.payment._id), angular.copy(vm.checkout._id), function(err, r){
                if(err)
                    toast.message(err.reason);
                else
                    toast.message('Konduto enviado com sucesso.');
            });
        }

        hoverIn();

    });
