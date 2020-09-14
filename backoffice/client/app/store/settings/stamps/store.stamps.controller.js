(function() {
    "use strict";
    _ = require("lodash");
    angular.module("fuseapp").controller("AdmStampsCtrl", AdmStampsCtrl);

    /** @ngInject */
    function AdmStampsCtrl($mdDialog, $scope, toast, Configurations, Sections) {
        var vm = this;

        // Data
        vm.form = {
            _id: Configurations._id,
            stamps: {
                general: _.get(Configurations, "stamps.general") || {
                    name: "Geral",
                    description: "",
                    style: null,
                    texts: []
                },
                sections: _.reduce(
                    Sections,
                    function(r, section, key) {
                        r[section.url] = _.get(
                            Configurations,
                            "stamps.sections." + section.url
                        ) || {
                            name: section.name,
                            description: "",
                            style: null,
                            texts: []
                        };
                        return r;
                    },
                    {}
                )
            }
        };

        // Vars
        vm.progressLoading = false;
        vm.styles = {
            Amarelo: "stamp-yellow",
            Azul: "stamp-blue",
            Laranja: "stamp-orange",
            Preto: "stamp-black",
            Verde: "stamp-green",
            Vermelho: "stamp-red"
        };

        // Methods
        vm.save = save;

        // Functions
        function save() {
            vm.progressLoading = true;
            Meteor.call("editSettings", angular.copy(vm.form), function(
                err,
                r
            ) {
                if (err) {
                    vm.progressLoading = false;
                    toast.message(err.reason);
                } else {
                    vm.progressLoading = false;
                    toast.message("Configurações editadas com sucesso");
                }
            });
        }
    }
})();
