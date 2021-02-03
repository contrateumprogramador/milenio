module.exports = function(ngModule) {
    require("./address-form.sass");

    ngModule.directive('addressForm', function() {
        return {
            restrict: 'E',
            template: require('./address-form.view.html'),
            replace: true,
            scope: {
                address: '=',
                submit: '=',
                afterSave: '=',
                internal: '='
            },
            controllerAs: 'vm',
            controller: function($mdDialog, $rootScope, $scope, $mdMedia, Loja, toast) {
                var vm = this;

                // Data
                vm.form = $scope.address;
                vm.internal = $scope.internal;
                vm.shippingInternal = Loja.Checkout.checkoutShipping();
                vm.shippings = Loja.Checkout.getShippings;

                // Methods
                vm.addressByZipcode = addressByZipcode;
                vm.addressSave = addressSave;
                vm.addressUpdate = addressUpdate;
                vm.checkMedia = checkMedia;

                if (vm.internal){
                    vm.form = vm.shippingInternal;
                }

                // Calls
                if (!vm.form || angular.equals(vm.form, {})){
                    addAddress();
                    // preenche os dados do endereço caso cep tenha sido enviado
                    if(vm.shippings() && vm.shippings().zipcode)
                        addressByZipcode();
                }

                $scope.$watch('address', function(newValue, oldValue, scope) {
                    if (newValue)
                        vm.form = newValue;
                });

                // Functions
                function addAddress() {
                    vm.form = {
                        title: '',
                        address: '',
                        number: '',
                        complement: '',
                        district: '',
                        zipcode: (vm.shippings()) ? vm.shippings().zipcode : '',
                        city: 'São Paulo',
                        state: 'SP',
                        options: {
                            collect: {
                                day: '',
                                time: ''
                            },
                            delivery: {
                                day: '',
                                time: ''
                            }
                        },
                        obs: ''
                    };
                }

                // Retorna Address com base no Zipcode
                function addressByZipcode() {
                    var zipcode = vm.form.zipcode;

                    if (zipcode && zipcode.length == 8) {
                        // primeira req = verifica se o cep está na faixa de ceps atendidos
                          Loja.Store.shipping(zipcode).then(function(first){
                            // segunda req = busca os dados no viacep
                            Loja.Store.address(zipcode).then(function(r) {
                                // Seta o campo de cep como valido.
                                vm.shippingForm.zipcode.$setValidity('zipcodeInvalid', true);
                                angular.forEach(r, function(value, key) {
                                    vm.form[key] = value;
                                });
                                Loja.Checkout.shipping(first.data.data, zipcode);
                            }, function(err) {
                                toast.message("Endereço não encontrado pelo CEP.");
                                // Limpa os Campos de Endereço
                                vm.form.address = '';
                                vm.form.number = '';
                                vm.form.district = '';
                                vm.form.zipcode = undefined;
                                vm.form.city = 'São Paulo';
                                vm.form.state = 'SP';
                            });
                        }, function(err){
                            toast.message('Região não atendida.');
                             // Limpa os Campos de Endereço
                                vm.form.address = '';
                                vm.form.number = '';
                                vm.form.district = '';
                                vm.form.city = 'São Paulo';
                                vm.form.state = 'SP';
                            // Seta o campo de cep como inválido.
                            vm.shippingForm.zipcode.$setValidity('zipcodeInvalid', false);
                        });
                    }
                }

                function addressSave() {
                    Loja.Customer.addressCreate(angular.copy(vm.form)).then(function(r) {
                        toast.message('Endereço Adicionado.');
                        saved('save');
                    }, error);
                }

                function addressUpdate() {
                    Loja.Customer.addressUpdate(vm.form._id, angular.copy(vm.form)).then(function(r) {
                        saved('update', angular.copy(vm.form));
                    }, error);
                }

                function checkMedia(media){
                    return $mdMedia(media);
                }

                function error(err) {
                    toast.message(err.data.message);
                }

                function saved(type, address) {
                    if ($scope.afterSave)
                        $scope.afterSave(type, address);

                    $mdDialog.hide();
                }
            }
        };
    });
};
