module.exports = function(ngModule) {
    require("./li-items-list.sass");

    var removeDiacritics = require("diacritics").remove;
    ngModule.directive("liItemsList", function() {
        return {
            restrict: "EA",
            template: require("./li-items-list.view.html"),
            replace: true,
            scope: {
                items: "=",
                rowSize: "=",
                orderBy: "=",
                scrollHorizontal: "="
            },
            controllerAs: "vm",
            controller: function(
                $scope,
                $timeout,
                $rootScope,
                $mdMedia,
                lodash
            ) {
                var vm = this,
                    rowSize = $scope.rowSize || 4;

                vm.scrollHorizontal = $scope.scrollHorizontal || false;

                //Methods
                vm.checkMedia = checkMedia;
                vm.search = $rootScope.search;
                vm.changeTab = changeTab;

                // Vars
                vm.itemsList = getItemsList();
                vm.show = vm.checkMedia("gt-sm") ? 5 : vm.itemsList.length;
                vm.limit = 0;

                $scope.$watch("items", function(newValue, oldValue, scope) {
                    prepareItems();
                });

                $scope.$watch(
                    function() {
                        return vm.checkMedia("gt-sm");
                    },
                    function(newValue, oldValue, scope) {
                        prepareItems();
                    }
                );

                // Functions
                function checkMedia(size) {
                    return $mdMedia(size);
                }

                /** Retorna os items passados pelo $scope da diretiva
                 * @param  {object} items - Recebe os items passados pelo $scope da diretiva
                 * @param  {lodash} lodash - Exclui do array todos items que não possuem propriedades de preço (options)
                 * @returns  - Retorna array de items limpo
                 */
                function getItemsList() {
                    var items = angular.copy($scope.items) || [];
                    lodash.remove(items, function(o) {
                        return o.options.length == 0;
                    });
                    return items;
                }

                function prepareItems() {
                    vm.itemsList = getItemsList();
                    vm.items = vm.itemsList;
                }

                function changeTab(forward) {
                    if(forward && vm.limit + vm.show < vm.items.length) vm.limit += vm.show;
                    else if(!forward && vm.limit - vm.show >= 0) vm.limit -= vm.show;
                }
            }
        };
    });
};
