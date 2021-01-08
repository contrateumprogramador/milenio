module.exports = function(ngModule) {
    require("./li-product-details.sass");

    ngModule.directive("liProductDetails", function() {
        return {
            restrict: "EA",
            template: require("./li-product-details.view.html"),
            replace: true,
            scope: {
                item: "=",
                breadcumbs: "=",
                image: "=",
                checkoutItem: "=",
                showTitle: "=",
                ctrl: "=",
                dialog: "=",
                index: "="
            },
            controllerAs: "vm",
            controller: function(
                $mdDialog,
                $rootScope,
                $scope,
                $mdMedia,
                $timeout,
                Loja,
                lodash
            ) {
                var vm = this;
                // Vars
                vm.item = $scope.item;
                vm.breadcumbs = $scope.breadcumbs;
                vm.image = $scope.image;
                vm.checkoutItem = $scope.checkoutItem;
                vm.index = $scope.index;
                vm.dialog = $scope.dialog || false;
                vm.showTitle = $scope.showTitle;
                vm.customization = vm.checkoutItem
                    ? vm.checkoutItem.customizations
                    : {};
                vm.options = selectOptions();
                vm.installments = Loja.Store.itemInstallments(vm.item || {});
                vm.quantity = vm.checkoutItem ? vm.checkoutItem.quant : 1;
                vm.tabDescriptions = getItemAttributes(vm.item.attributes);
                // Methods
                vm.addToCart = $scope.$parent.vm.addToCart = addToCart;
                vm.changeQuant = changeQuant;
                vm.checkMedia = checkMedia;
                vm.setCustomization = setCustomization;
                vm.updateInstallments = updateInstallments;
                vm.getTag = getTag;
                vm.isIndisponible = isIndisponible


                // Customizações do item
                Loja.Store.customizations(vm.item._id).then(function(r) {
                    vm.customizations = r.data.data;
                });

                // Functions
                function isIndisponible() {
                    return vm.item.stock === -1 || (vm.item.stock === 1 && !vm.item.max)
                }

                /** Chama a função no backend para adicionar o item ao carrinho
                 */
                function addToCart() {
                    Loja.Checkout.itemAdd(
                        angular.copy(vm.item),
                        vm.quantity,
                        vm.customization,
                        vm.options,
                        true,
                        vm.index
                    );
                }

                /** Retorna os attributos dos items
                 * @param  {object} attributes - Recebe objeto do item
                 * @returns  {object} Retorna objeto de atributos do item limpo
                 */
                function getItemAttributes(attributes) {
                    lodash.remove(attributes, function(o) {
                        return (
                            o.title == "Referência" || o.title == "Dimensões"
                        );
                    });
                    return attributes;
                }

                function changeQuant(value) {
                    if(vm.item.stock === 1) {
                        if(vm.quantity + value <= vm.item.max) vm.quantity += value;
                    }
                    else
                        vm.quantity += value;

                    if (vm.quantity < 1) vm.quantity = 1;
                }

                function checkoutItemConfig(item) {
                    return {
                        _id: item._id,
                        customizations: vm.customization || {},
                        name: item.name,
                        name_nd: item.name_nd,
                        options: vm.options || {},
                        picture: item.pictures[0] || "",
                        url: item.url,
                        installments: vm.installments || {}
                    };
                }

                function checkMedia(size) {
                    return $mdMedia(size);
                }

                function setCustomization(group, customization) {
                    vm.customization[group._id] = {
                        _id: group._id,
                        type: group.type,
                        option: customization
                    };
                }

                function selectOptions() {
                    var options = {};
                    if (vm.checkoutItem) {
                        vm.item.options.forEach(function(option, key) {
                            if (option.name == vm.checkoutItem.options.name)
                                options = vm.item.options[key];
                        });
                    } else options = vm.item.options[0];
                    return options;
                }

                function updateInstallments() {
                    $timeout(function() {
                        vm.installments = Loja.Store.itemInstallments(
                            vm.item || {},
                            vm.options
                        );
                    }, 100);
                }

                function getTag(url) {
                    const tag = lodash.find(vm.item.tags, { url });
                    return lodash.get(tag, "name") || false;
                }
            }
        };
    });
};
