module.exports = function(ngModule) {
    require("./li-opinions.sass");

    ngModule.directive("liOpinions", function() {
        return {
            restrict: "EA",
            template: require("./li-opinions.view.html"),
            replace: true,
            scope: {
                opinions: "=",
                productId: "="
            },
            controllerAs: "vm",
            controller: function($scope, $mdDialog, Loja, toast) {
                var vm = this;

                vm.productId = $scope.productId
                vm.user = Loja.Auth.me;

                vm.grades = [
                    { title: "Média", value: "avg" },
                    { title: "Custo Benefício", value: "costBenefit" },
                    { title: "Características", value: "characteristics" },
                    { title: "Qualidade", value: "quality" },
                ]

                vm.opinions = [
                    {
                        title: "Muito bom",
                        date: new Date(),
                        opinion: "Produto de muita qualidade, utilizei na minha área externa e ficou lindo",
                        avg: 4,
                        costBenefit: 4,
                        characteristics: 4,
                        quality: 5,
                        user: "Bruno Marra de Melo"
                    },
                    {
                        title: "Mais ou menos",
                        date: new Date(),
                        opinion: "Produto deixou a desejar depois de 5 meses de uso começou a soltar umas pontas",
                        avg: 3,
                        costBenefit: 3,
                        characteristics: 4,
                        quality: 2,
                        user: "Bruno Marra de Melo"
                    },
                    {
                        title: "Mais ou menos",
                        date: new Date(),
                        opinion: "Produto deixou a desejar depois de 5 meses de uso começou a soltar umas pontas",
                        avg: 3,
                        costBenefit: 3,
                        characteristics: 4,
                        quality: 2,
                        user: "Bruno Marra de Melo"
                    }
                ]

                //Methods
                vm.starFilled = starFilled
                vm.opinionDialog = opinionDialog

                //Functions
                function starFilled(current, opinion, key) {
                    return (current+1) <= opinion[key]
                }

                function opinionDialog(ev) {        
                    $mdDialog.show({
                        controller: function($mdDialog, Loja) {
                            var ctrl = this;

                            ctrl.form = {
                                costBenefit: 1,
                                quality: 1,
                                characteristics: 1,
                                productId: vm.productId
                            }

                            //Methods
                            ctrl.cancel = cancel
                            ctrl.select = select
                            ctrl.starFilled = starFilled
                            ctrl.submit = submit
                            
                            //Functions
                            function cancel(){
                                $mdDialog.cancel();
                            };

                            function select(index, key) {
                                ctrl.form[key] = index+1
                            }

                            function starFilled(index, key) {
                                return (index+1) <= ctrl.form[key]
                            }

                            function submit() {
                                $mdDialog.hide("Opinião registrada com sucesso");
                            }
                        },
                        controllerAs: 'ctrl',
                        template: require('../../components/li-opinions/li-opinions-dialog.view.html'),
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: true
                    })
                    .then(function(answer) {
                        toast.message(answer)
                    });
                }
            }
        };
    });
};
