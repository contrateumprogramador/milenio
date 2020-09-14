"use strict";

angular
    .module("fuseapp")
    .controller("DashboardCtrl", function(
        $filter,
        $mdDialog,
        $scope,
        $stateParams,
        toast
    ) {
        var vm = this;

        // Data
        vm.affiliate = {
            _id: $stateParams.affiliateId,
            name: $stateParams.affiliateName
        };
        vm.date = _dateGet(0, new Date());
        vm.statement = [];
        vm.stats = {};

        // Attributes
        vm.comissionStatus = {
            canceled: "cancelado",
            paid: "Pago",
            pending: "Pendente"
        };
        vm.processes = 0;
        vm.progressLoading = false;

        // Methods
        vm.comissionAction = comissionAction;
        vm.dateChange = dateChange;
        vm.dateChangeDisableNextButton = dateChangeDisableNextButton;
        vm.dataGet = dataGet;

        function comissionAction(type, comission, ev) {
            let method, options, message;

            var confirm = $mdDialog
                .confirm()
                .ariaLabel("Comissão")
                .targetEvent(ev)
                .cancel("Cancelar");

            switch (type) {
                case "pay":
                    method = "Comission.update";
                    options = { $set: { status: "paid" } };
                    message = 'Status da comissão alterado para "Pago"';

                    confirm
                        .title("Comissão Paga")
                        .textContent(
                            `Confirma o pagamento da comissão no valor de ${$filter(
                                "currency"
                            )(comission.comission)}?`
                        )
                        .ok("Confirmar");
                    break;
                case "remove":
                    method = "Comission.remove";
                    message = "Comissão removida";

                    confirm
                        .title("Remover Comissão")
                        .textContent(
                            `Deseja remover a comissão no valor de ${$filter(
                                "currency"
                            )(comission.comission)}?`
                        )
                        .ok("Remover");
                    break;
            }

            $mdDialog.show(confirm).then(function() {
                vm.progressLoading = true;
                Meteor.call(method, comission._id, options, function(err, r) {
                    vm.progressLoading = false;

                    if (err) {
                        toast.message(err.reason);
                    } else {
                        toast.message(message);
                        dataGet();
                    }
                });
            });
        }

        function dataGet() {
            function _getMethod(method) {
                if (
                    vm.affiliate._id ||
                    Roles.userIsInRole(Meteor.userId(), "affiliate")
                )
                    return `Comission.${method}`;

                return `${method}.admin`;
            }

            function _processUpdate(value) {
                vm.processes += value;
                vm.progressLoading = vm.processes > 0;
                if (!$scope.$$phase) $scope.$apply();
            }

            function _get(method, date, callback) {
                _processUpdate(1);
                Meteor.call(method, date, vm.affiliate._id, function(err, r) {
                    if (err) toast.message(err.reason);
                    else callback(r);
                    _processUpdate(-1);
                });
            }

            _get(_getMethod("Stats"), vm.date, function(r) {
                vm.stats = r;
            });

            _get(_getMethod("Stats"), _dateGet(-1), function(r) {
                vm.statsLast = r;
            });

            if (Roles.userIsInRole("affiliate"))
                _get(_getMethod("statement"), vm.date, function(r) {
                    vm.statement = r;
                });
        }

        function _dateGet(value, date) {
            return new Date(
                moment(date || vm.date)
                    .add(value, "months")
                    .startOf("month")
                    .format()
            );
        }

        function dateChange(value) {
            vm.date = _dateGet(value);
            dataGet();
        }

        function dateChangeDisableNextButton() {
            return vm.date.getTime() == _dateGet(0, new Date()).getTime();
        }

        dataGet();
    });
