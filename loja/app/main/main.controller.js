module.exports = function (ngModule) {
    ngModule.controller("MainCtrl", function (
        $window,
        $document,
        $filter,
        $mdDialog,
        $mdMedia,
        $mdSidenav,
        $mdToast,
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $timeout,
        Loja,
        lodash,
        toast,
        itemCheckout
    ) {
        var ctrl = this;
        $mdToast.show({
            hideDelay: 40000
        });
        // Data

        // Vars
        ctrl.loading = false;
        ctrl.title = {};
        ctrl.loja = Loja

        $rootScope.packages = [];
        $rootScope.pageTitle = "Milenio Móveis";
        $rootScope.settings = Loja.Store.settings;
        $rootScope.terms = [];

        // LojaInteligente
        Loja.loading(
            function () {
                ctrl.loading = true;
            },
            function () {
                ctrl.loading = false;
            }
        );

        Loja.Store.terms({}).then(
            function (r) {
                $rootScope.terms = r.data.data;
            },
            function (err) {
                toast.message(err.data.message);
            }
        );

        // Methods
        ctrl.checkMedia = checkMedia;
        ctrl.mediaClass = mediaClass;
        ctrl.openNewsletter = openNewsletter;

        $rootScope.affiliateLogout = affiliateLogout;

        function affiliateLogout() {
            delete $rootScope.affiliate;
            Loja.Checkout.resetCart();
            $state.go("home", {}, {
                reload: true
            });
        }

        // Carrega as Seções da Loja
        Loja.Store.sections().then(
            function (r) {
                $rootScope.sections = r.data.data;
            },
            function (err) {
                toast.message(err.data.message);
            }
        );

        // Funcitons
        function checkMedia(size) {
            return $mdMedia(size);
        }

        function mediaClass() {
            if ($mdMedia("xs")) return "is-mobile";
            else if (!$mdMedia("gt-sm")) return "is-ipad";
            else if ($mdMedia("md")) return "is-md";

            return;
        }

        function openNewsletter(ev) {
            $mdDialog
                .show({
                    controller: function ($mdDialog) {
                        var ctrl = this;
                        ctrl.newsletter = {
                            firstname: "",
                            lastname: "",
                            email: "",
                            phone: ""
                        };

                        ctrl.cancel = function () {
                            $mdDialog.cancel();
                        };
                    },
                    controllerAs: "vm",
                    template: require("../components/newsletter-dialog/newsletter-form.dialog.html"),
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true
                })
                .then(function (answer) {
                    toast.message("Você está cadastrado em nossa Newsletter!");
                });
        }

        // Ao mudar de state
        $rootScope.$on("$stateChangeSuccess", function (
            event,
            toState,
            toParams,
            fromState,
            fromParams,
            options
        ) {
            // console.log(document.querySelector("#container"))
            angular
                .element(document.querySelector("#Content"))
                .scrollToElementAnimated(document.querySelector("#container"));
            window.dataLayer.push({
                event: "pageView",
                action: toParams.sectionUrl
            });
        });

        $scope.$watch(
            function () {
                return ctrl.title;
            },
            function (title, oldValue, scope) {
                $rootScope.pageTitle = title.title ?
                    title.title + " | Milênio Móveis" :
                    "Milênio Móveis";
            }
        );

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        if(!getCookie("confirmTerms")) {
            ctrl.showCookiesConfirm = true;
        }
    });
};