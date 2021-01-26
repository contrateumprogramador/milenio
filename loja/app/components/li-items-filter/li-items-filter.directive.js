module.exports = function(ngModule) {
    require("./li-items-filter.sass");

    var removeDiacritics = require("diacritics").remove;
    ngModule.directive("liItemsFilter", function() {
        return {
            restrict: "EA",
            template: require("./li-items-filter.view.html"),
            replace: true,
            scope: {
                items: "=",
                rowSize: "=",
                environment: "=",
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
                vm.environment = $scope.environment

                // Vars
                vm.itemsList = getItemsList();
                vm.limit = 3;

                angular
                    .element(document.querySelector("#Content"))
                    .bind("scroll", function(e) {
                        var top = e.srcElement.scrollTop;
                        var limit = Math.ceil(top / 300);

                        if (limit > vm.limit) {
                            vm.limit = limit;
                            $scope.$apply();
                        }
                    });

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
                    if(!vm.environment) {
                        lodash.remove(items, function(o) {
                            return o.options.length == 0;
                        });
                    }
                    return items;
                }

                function prepareItems() {
                    vm.itemsList = getItemsList();

                    if (vm.checkMedia("gt-sm")) {
                        vm.flex = Math.round(100 / rowSize);
                        vm.items = [];
                        vm.lines = Math.ceil(vm.itemsList.length / rowSize); // Calcula número de linhas

                        // Gera Array de linhas e items
                        for (var i = 0; i < vm.lines; i++) {
                            vm.items.push(vm.itemsList.splice(0, rowSize));
                        }
                    } else {
                        vm.items = vm.itemsList;
                    }
                }
            }
        };
    });
};
