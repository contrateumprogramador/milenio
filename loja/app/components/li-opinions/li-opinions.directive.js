module.exports = function(ngModule) {
    require("./li-opinions.sass");

    ngModule.directive("liOpinions", function() {
        return {
            restrict: "EA",
            template: require("./li-opinions.view.html"),
            replace: true,
            scope: {
                productId: "="
            },
            controllerAs: "vm",
            controller: function($scope, $mdDialog, Loja, toast) {
                var vm = this;

                vm.productId = $scope.productId;
                vm.user = Loja.Auth.me;
                vm.opinions = [];

                Loja.Adm.opinions(vm.productId).then((r) => {
                    vm.opinions = r.data.data;
                });

                vm.grades = [
                    { title: "Média", value: "avg" },
                    // { title: "Custo Benefício", value: "costBenefit" },
                    // { title: "Características", value: "characteristics" },
                    // { title: "Qualidade", value: "quality" },
                ];

                //Methods
                vm.starFilled = starFilled;

                //Functions
                function starFilled(current, opinion, key) {
                    return (current+1) <= opinion[key];
                }
            }
        };
    });
};
