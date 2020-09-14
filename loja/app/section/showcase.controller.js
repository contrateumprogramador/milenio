module.exports = function(ngModule) {
    require('./section.sass');
    ngModule.controller('SectionShowcaseCtrl', function($document, $mdDialog, $rootScope, $scope, $filter, $state, $stateParams, $mdMedia, $location, Loja, Items, toast) {
        var vm = this;

        // Vars
        vm.vitrine = $filter('orderBy')(Items, '-rank') || [];

        // Methods
        vm.section = $scope.$parent.vm.section;

        //Root Scope
        $rootScope.pageTitle = vm.section().name + ' : Milênio Móveis';

        // Funtions

        //Data Layers
        var dataLayerProducts = [];
        var dataLayer = window.dataLayer = window.dataLayer || [];

        angular.forEach(vm.vitrine, function(item, key){
            var tagNames = [];
            angular.forEach(item.tags, function(item, key){
                tagNames.push(item.name);
            });

            var product = {
                ecomm_prodid: item._id,
                preco_produto: item.options[0].salesPrice || item.options[0].price,
                ecomm_procat: tagNames,
                ecomm_proname: item.name
            };

            dataLayerProducts.push(product);
        });
        
        dataLayer.push({
            event: 'ngRouteChange',
            attributes: {
                event: 'ngRouteChange',
                ecomm_pagetype: 'category',
                listProducts: dataLayerProducts
            }
        });
        
    });
};
