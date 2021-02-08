module.exports = function(ngModule) {
    require("./cookies-confirm.sass");

    ngModule.directive("cookiesConfirm", function() {
        return {
            restrict: "EA",
            template: require("./cookies-confirm.view.html"),
            replace: true,
            scope: {
                showCookiesConfirm: "="
            },
            controllerAs: "vm",
            controller: function($mdDialog, $scope, Loja, toast) {
                var vm = this;

                vm.showCookiesConfirm = $scope.showCookiesConfirm
                
                //Methods
                vm.accept = accept

                //Functions
                function setCookie(cname, cvalue, exdays) {
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                    var expires = "expires=" + d.toUTCString();
                    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
                }

                function accept() {
                    setCookie("confirmTerms", true)
                    vm.showCookiesConfirm = false
                }
            }
        };
    });
};
