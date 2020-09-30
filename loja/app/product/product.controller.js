module.exports = function(ngModule) {
    require('./product.sass');
    ngModule.controller('ProductCtrl', function($document, $mdDialog, $rootScope, $scope, $state, $mdMedia, $location, Loja, toast, RelatedProducts, Product, from, itemCheckout) {
        var vm = this;

        if (RelatedProducts)
            RelatedProducts.splice(5);

        // Vars
        vm.product = Product || {};
        vm.relatedProducts = angular.copy(RelatedProducts) || [];
        vm.relatedsRowSize = (vm.relatedProducts.length < 4) ? 4 : vm.relatedProducts.length;
        vm.breadcumbs = from.split("/");
        vm.breadcumbs = vm.breadcumbs.slice(vm.breadcumbs.indexOf("mobiliario")+1);

        //Root Scope
        $rootScope.pageTitle =  vm.product.name + ' : Milênio Móveis';

        vm.tabDescriptions = vm.product.attributes;
        // Methods

        //Data Layer
        var dataLayer = window.dataLayer = window.dataLayer || [];
        var tagNames = [];
        angular.forEach(vm.product.tags, function(item, key){
            tagNames.push(item.name);
        });

        dataLayer.push({
            event: 'ngRouteChange',
            attributes: {
                event: 'ngRouteChange',
                ecomm_pagetype: $location.path(),
                product: {
                    ecomm_prodid: vm.product._id,
                    ecomm_procat: tagNames,
                    ecomm_proname: vm.product.name,
                    ecomm_totalvalue: vm.product.options[0].salesPrice || vm.product.options[0].price,
                    ecomm_pagetype: 'product'
                }
            }
        });
    });
};
