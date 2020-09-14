module.exports = function(ngModule){
    require('./shipping.sass');
    ngModule.controller('ShippingCtrl', function($mdDialog, $rootScope, $scope, $state, Addresses, Loja, toast) {
        var layout = $scope.$parent.layout,
        vm = this;

        //controla o loading
        Loja.loading(
            function() {
                vm.progressLoading = true;
            },
            function() {
                vm.progressLoading = false;
            }
        );

        // Layout
        $rootScope.pageTitle = 'Checkout : Milênio Móveis';

        // Data
        vm.cart = Loja.Checkout.cart;
        vm.checkoutShipping = Loja.Checkout.checkoutShipping(); 
        vm.addresses = (vm.cart().internal) ? vm.checkoutShipping : (Addresses.data.data || []);
        vm.shippings = Loja.Checkout.getShippings;

        // Vars
        vm.selected = false;

        // Methods
        vm.addAddress = addAddress;
        vm.addressListDialog = addressListDialog;
        vm.addressRemove = addressRemove;
        vm.addressSelected = addressSelected;
        vm.afterSave = afterSave;
        vm.selectAddress = selectAddress;
        vm.submit = submit;


        // Functions
        function addAddress() {
            vm.form = {
                title: 'Residencial',
                address: '',
                number: '',
                complement: '',
                district: '',
                zipcode: '',
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

        function addressSave() {
            Loja.Customer.addressCreate(angular.copy(vm.form)).then(function(r) {
            });
        }

        function addressUpdate() {
            if (!vm.cart().internal){
                Loja.Customer.addressUpdate(vm.form._id, angular.copy(vm.form)).then(function(r) {
                });
            }
        }

        function addressListDialog(ev) {
            var address = angular.copy(vm.address);

            $mdDialog.show({
                controller: function($mdDialog) {
                    var ctrl = this;

                    // Methods
                    ctrl.selectAddress = selectAddress;

                    //Vars
                    ctrl.addresses = vm.addresses;
                    ctrl.addressSelected = vm.addressSelected;

                    function selectAddress(address) {
                        vm.form = angular.copy(address);
                        ctrl.cancel();
                    }

                    ctrl.cancel = function(){
                        $mdDialog.cancel();
                    };
                },
                controllerAs: 'vm',
                template: require('../../components/addressesList/addresses-list-dialog.view.html'),
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true
            })
            .then(function(answer) {
                //addressesGet();
            });
        }

        // Remove Address
        function addressRemove(ev) {
            var confirm = $mdDialog.confirm()
            .title('Excluir endereço?')
            .textContent('Confirma a exclusão do endereço ' + vm.form.title + '?')
            .ariaLabel('Excluir endereço?')
            .targetEvent(ev)
            .ok('Excluir')
            .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                Loja.Customer.addressDelete(vm.form._id).then(function() {
                    toast.message('Endereço excluído.');
                    afterSave();
                }, function(err) {
                    toast.message(err.reason);
                });
            }, function() {
                $scope.status = 'You decided to keep your debt.';
            });
        }

        function addressSelected(address) {
            if (vm.form && !vm.cart().internal){
                vm.selected = true;
                return (vm.form._id == address._id);
            }
        }

        function afterSave(type, address) {
            Loja.Customer.addresses().then(function(r) {
                vm.addresses = r.data.data;
                vm.form._id = '';
                if (type == 'save')
                    selectAddress(vm.addresses[vm.addresses.length-1]);
                else
                    selectAddress(address);
            }, function(err) {
                toast.message(err.reason);
            });
        }

        function submit(ev, form) {
            if (!form._id){
                addressSave();
                Loja.Checkout.shipping(null, null, angular.copy(form));

                Loja.Checkout.payment(ev, function() {
                    $rootScope.goTo = 'pedidos';
                    $state.go('user');
                });
            }else{
                addressUpdate();
                Loja.Checkout.shipping(null, null, angular.copy(form));

                Loja.Checkout.payment(ev, function() {
                    $rootScope.goTo = 'pedidos';
                    $state.go('user');
                });
            }
        }

        function selectAddress(address) {
            if (!vm.cart().internal){
                vm.form = angular.copy(address);
                Loja.Store.shipping(vm.form.zipcode).then(function(first){
                    Loja.Checkout.shipping(first.data.data, vm.form.zipcode);
                }, function(err) {
                    toast.message(err.data.message);
                });
            }
        }

        // seleciona o primeiro endereço
        if(vm.addresses.length > 0 && vm.shippings() && !vm.shippings().zipcode)
            selectAddress(vm.addresses[0]);

        // se tiver sido enviado, e ele já existir, seleciona
        if(vm.shippings() && vm.shippings().zipcode){
            vm.addresses.forEach(function(address){
                if(address.zipcode == vm.shippings().zipcode)
                selectAddress(address);
            });
        }

    });
};
