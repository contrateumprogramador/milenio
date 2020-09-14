'use strict'

angular.module('fuseapp')
    .controller('SellersCtrl', function($mdDialog, $reactive, $scope, $state, konduto, toast) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data
        getSellers();

        // Vars

        // Methods
        vm.cancel = cancel;
        vm.save = save;
        vm.sellerAvatar = sellerAvatar;
        vm.querySearch = querySearch;

        // Functions
        function cancel(argument) {
            $mdDialog.cancel();
        }

        function getSellers(){
            Meteor.call('listSellers', function(err, r) {
                (err) ? toast.message(err.reason) : vm.users = r;
                (!vm.checkout.sellers) ? vm.checkout.sellers = [] : sellersMatch();
            });
        }

        function save() {
            Meteor.call('sellersEdit', angular.copy(vm.checkout), function(err, r){
                if(err)
                    toast.message(err.reason);
                else
                    $mdDialog.hide('Vendedores Editados com sucesso.');
            });
        }

        function sellerAvatar(seller) {
            if (!seller.name)
                return '?';

            return seller.name.substr(0, 1).toUpperCase();
        }

        function sellersMatch() {
            var newArray = [];
            vm.users.forEach(function (user) {
                if(vm.checkout.sellers.indexOf(user._id) > -1){
                    newArray.push({
                        _id: user._id,
                        name: user.profile.firstname
                    });
                }
            });
            vm.checkout.sellers = newArray;
        }

        function querySearch(query) {
            var results = (query) ? vm.users.filter(createFilterFor(query)) : [];
            results = results.map(function(register){
                return {
                    _id: register._id,
                    name: register.profile.firstname
                }
            });
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = Diacritics.remove(angular.lowercase(query));
            return function filterFn(variable) {
                return angular.lowercase(variable.profile.firstname).match(lowercaseQuery);
            };

        }

    });
