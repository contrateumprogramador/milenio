module.exports = function(ngModule) {
    require('./policies.sass');
    ngModule.controller('PoliciesCtrl', function($stateParams, Policies) {
        var vm = this;

        //Var
        vm.policies = Policies || [];

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        if($stateParams.url === "termo-de-uso-e-privacidade")
            setCookie("confirmTerms", true)
    });
};
