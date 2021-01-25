"use strict";

angular
    .module("fuseapp")
    .controller("ProductOptionsCtrl", function(
        $mdDialog,
        $reactive,
        $scope,
        $state,
        konduto,
        toast
    ) {
        $reactive(this).attach($scope);

        var vm = this;

        // Data
        vm.option = vm.item.options[0];
        vm.customization = {};

        if (!Roles.userIsInRole(Meteor.user(), ["affiliate"]))
            vm.item.options.push({
                name: "Personalizado",
                price: 0,
                custom: true
            });

        // Vars

        // Methods
        vm.cancel = cancel;
        vm.save = save;
        vm.setCustomization = setCustomization;

        // Functions
        function cancel(argument) {
            $mdDialog.cancel();
        }

        function checkoutItemConfig(item) {
            return {
                _id: item._id,
                customizations: vm.customization || {},
                name: item.name,
                name_nd: item.name_nd,
                options: vm.option || {},
                picture: item.pictures[0] || "",
                code: item.code,
                url: item.url,
                installments: item.installments || {}
            };
        }

        function save() {
            $mdDialog.hide(checkoutItemConfig(vm.item));
        }

        function setCustomization(group, customization) {
            vm.customization[group._id] = {
                _id: group._id,
                type: group.type,
                option: customization
            };
        }
    });
