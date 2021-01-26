module.exports = function(ngModule) {
    require('./section.sass');
    var removeDiacritics = require('diacritics').remove;
    ngModule.controller('SectionItemsListCtrl', function($document, $filter, $mdDialog, $rootScope, $scope, $state, $stateParams, $mdMedia, $location, Loja, Items, toast) {
        var vm = this,
            itemsFiltered = angular.copy(Items);

        // Methods
        vm.reorder = reorder;
        vm.search = search;
        vm.section = $scope.$parent.vm.section;
        vm.tag = getTag;
        vm.myPagingFunction = myPagingFunction;
        vm.environment = $stateParams.environment

        // Vars
        vm.orderBy = '';
        vm.items = angular.copy(itemsFiltered) || [];
        vm.itemSearch = '';
        vm.order = [{
            name: 'Popularidade',
            value: '-rank'
        }, {
            name: 'Nome',
            value: 'name'
        }, {
            name: 'Maior Preço',
            value: '-options[0].price'
        }, {
            name: 'Menor Preço',
            value: 'options[0].price'
        }];
        vm.title = title();

        // Metods

        //Root Scope
        $rootScope.pageTitle = (vm.title.subtitle) ? vm.title.title + ' | ' + vm.title.subtitle +' : Milênio Móveis' : vm.title + ' : Milênio Móveis';

        // Funtions
        function myPagingFunction(){
        }

        function getTag() {
            var r = {};
            if ($rootScope.sections) {
                angular.forEach($rootScope.sections, function(section) {
                    if (section.url == $stateParams.sectionUrl) {
                        angular.forEach(section.subSections, function(tag){
                            if (tag.url == $stateParams.tagUrl)
                                r = tag;
                        });
                    }
                });
            }
            return r;
        }

        function reorder() {
            vm.items = $filter('orderBy')(itemsFiltered, vm.orderBy || '-rank');
        }

        reorder();

        // Por algum motivo, o orderBy só funciona
        // se for chamado antes
        // reorder();

        function search() {
            var term = removeDiacritics(vm.itemSearch.toLowerCase());

            itemsFiltered = $filter('filter')(Items, function(item) {
                return (vm.itemSearch === '' || item.name_nd.match(term));
            });
            reorder();
        }

        function title() {
            if ($stateParams.tagUrl == 'todos') {
                return vm.section().name;
            } else {
                return {
                    title: vm.tag().name,
                    subtitle: vm.section().name
                };
            }
        }

        //Data Layers
        var dataLayerProducts = (vm.environment) ? Items : [];
        var dataLayer = window.dataLayer = window.dataLayer || [];

        if(!vm.environment) {
            angular.forEach(vm.items, function(item, key){
                var tagNames = [];
                angular.forEach(item.tags, function(item, key){
                    tagNames.push(item.name);
                });
    
    
    
                var product = {
                    ecomm_prodid: item._id,
                    preco_produto: (item.options[0]) ? (item.options[0].salesPrice || item.options[0].price) : '',
                    ecomm_procat: tagNames,
                    ecomm_proname: item.name
                };
    
                dataLayerProducts.push(product);
            });
        }
        
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
