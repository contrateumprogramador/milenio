module.exports = function(ngModule) {
    require("./li-opinions.sass");

    ngModule.directive("liOpinions", function() {
        return {
            restrict: "EA",
            template: require("./li-opinions.view.html"),
            replace: true,
            scope: {
                items: "="
            },
            controllerAs: "vm",
            controller: function() {
                var vm = this;

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

                //Functions
                function starFilled(current, opinion, key) {
                    return (current+1) <= opinion[key]
                }
            }
        };
    });
};
