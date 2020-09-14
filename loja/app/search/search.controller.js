module.exports = function(ngModule) {
    require("./search.sass");
    var removeDiacritics = require("diacritics").remove;
    ngModule.controller("SearchCtrl", function(
        $document,
        $filter,
        $mdDialog,
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $mdMedia,
        $location,
        Loja,
        toast
    ) {
        var vm = this;

        // Data
        document.getElementById("searchText").focus();
        vm.searchText = $stateParams.search;
        setTitle();
        $scope.$parent.ctrl.search = vm.searchText;

        $scope.$parent.ctrl.searchTyping = typing;

        vm.itemsFiltered = [];
        if (vm.searchText) getItems();

        // Vars

        // Methods
        vm.typing = typing;

        //Functions
        function configureString(value) {
            return removeDiacritics(value.toLowerCase()).trim();
        }

        function getItems() {
            vm.loading = true;
            Loja.Store.items({
                name_nd: "%" + configureString(vm.searchText) + "%"
            }).then(
                function(r) {
                    vm.items = r.data.data;
                    vm.itemsFiltered = angular.copy(vm.items);
                    vm.loading = false;
                    vm.empty = vm.itemsFiltered.length == 0 ? true : false;
                    // Data Layers
                    var dataLayerProducts = [];
                    var dataLayer = (window.dataLayer = window.dataLayer || []);

                    angular.forEach(vm.items, function(item, key) {
                        var product = {
                            ecomm_prodid: item._id,
                            preco_produto:
                                item.options[0].salesPrice ||
                                item.options[0].price,
                            ecomm_proname: item.name
                        };

                        dataLayerProducts.push(product);
                    });

                    dataLayer.push({
                        event: "ngRouteChange",
                        attributes: {
                            event: "ngRouteChange",
                            ecomm_pagetype: "search",
                            listProducts: dataLayerProducts
                        }
                    });
                },
                function(err) {
                    vm.items = [];
                    vm.itemsFiltered = angular.copy(vm.items);
                    vm.loading = false;
                    vm.empty = vm.itemsFiltered.length == 0 ? true : false;
                }
            );
        }

        function typing(searchTerm) {
            if (searchTerm) vm.searchText = searchTerm;

            if (vm.searchText && vm.searchText.trim().length == 3) getItems();
            else if (vm.items) {
                vm.itemsFiltered = $filter("filter")(angular.copy(vm.items), {
                    name_nd: configureString(vm.searchText)
                });
                vm.empty = vm.itemsFiltered.length == 0 ? true : false;
            }
            setTitle();
        }

        function setTitle() {
            var title = vm.searchText ? vm.searchText + " -" : "";
            $rootScope.pageTitle = "Busca: " + title + " Milênio Móveis";
        }
    });
};
