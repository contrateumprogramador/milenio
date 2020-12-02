module.exports = function(ngModule) {
    var removeDiacritics = require("diacritics").remove;
    ngModule.controller("MainCtrl", function(
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
        $mdToast.show({ hideDelay: 40000 });
        // Data

        // Vars
        ctrl.loading = false;
        ctrl.title = {};
        ctrl.sections = [
            {
                category: "tela-sling",
                icon: "/assets/lojainteligente/imgs/fibra-sintetica.svg",
                name: "Tela Sling"
            },
            {
                category: "ombrelones",
                icon: "/assets/lojainteligente/imgs/ombrelones.svg",
                name: "Ombrelones"
            },
            {
                category: "corda-nautica",
                icon: "/assets/lojainteligente/imgs/fibra-sintetica.svg",
                name: "Corda Náutica"
            },
            {
                category: "fibra-sintetica",
                icon: "/assets/lojainteligente/imgs/sofa.svg",
                name: "Fibra Sintética"
            },
            {
                category: "madeira",
                icon: "/assets/lojainteligente/imgs/madeira.svg",
                name: "Madeira"
            },
            {
                category: "condominio",
                icon: "/assets/lojainteligente/imgs/condominio.svg",
                name: "Condomínio"
            }
        ];

        ctrl.user = Loja.Auth.me;
        ctrl.cart = Loja.Checkout.cart;
        ctrl.cartSideNavIsOpen = false;
        ctrl.search = "";
        ctrl.searchEmpty = true;
        ctrl.searchItems = [];
        ctrl.searchItemsFiltered = false;
        ctrl.subHeader = false;
        ctrl.subMenu = false;
        ctrl.subMenuBanners = {};
        ctrl.subSearch = false;

        $rootScope.packages = [];
        $rootScope.pageTitle = "Milenio Móveis";
        $rootScope.sections = [];
        $rootScope.settings = Loja.Store.settings;
        $rootScope.terms = [];

        // LojaInteligente
        Loja.loading(
            function() {
                ctrl.loading = true;
            },
            function() {
                ctrl.loading = false;
            }
        );

        Loja.Store.terms({}).then(
            function(r) {
                $rootScope.terms = r.data.data;
            },
            function(err) {
                toast.message(err.data.message);
            }
        );

        // Methods
        ctrl.checkMedia = checkMedia;
        ctrl.goTo = goTo;
        ctrl.logout = logout;
        ctrl.mediaClass = mediaClass;
        ctrl.openNewsletter = openNewsletter;
        ctrl.openSectionFilters = openSectionFilters;
        ctrl.searchSubmit = searchSubmit;
        ctrl.searchTyping = searchTyping;
        ctrl.section = getSection;
        ctrl.sign = sign;
        ctrl.subMenuBanner = subMenuBanner;
        ctrl.subMenuItems = subMenuItems;
        ctrl.toggleSidenav = toggleSidenav;
        ctrl.toggleSubHeader = toggleSubHeader;

        $rootScope.affiliateLogout = affiliateLogout;

        function affiliateLogout() {
            delete $rootScope.affiliate;
            Loja.Checkout.resetCart();
            $state.go("home", {}, { reload: true });
        }

        // Carrega as Seções da Loja
        Loja.Store.sections().then(
            function(r) {
                $rootScope.sections = r.data.data;
            },
            function(err) {
                toast.message(err.data.message);
            }
        );

        // Funcitons
        function checkMedia(size) {
            return $mdMedia(size);
        }

        function getSection() {
            var r = {};
            if ($rootScope.sections) {
                angular.forEach($rootScope.sections, function(section) {
                    if (section.url == $stateParams.sectionUrl) r = section;
                });
            }
            return r;
        }

        function getSubMenuBanners() {
            ctrl.sections.forEach(function(section) {
                Loja.Store.banners("menu-" + section.category).then(
                    function(r) {
                        var banners = lodash.get(r, "data.data.0.banners");

                        if (banners)
                            ctrl.subMenuBanners[section.category] = banners[0];
                    },
                    function(err) {
                        console.error(err);
                    }
                );
            });
        }
        getSubMenuBanners();

        /**
         * @param  {string} category - Nome do state a ser direcionado
         */
        function goTo(category) {
            var states = ["about", "contact", "location", "policies"];
            if (states.indexOf(category) > -1) {
                $state.go(category);
                toggleSidenav("left");
            } else if (category == "cart") {
                /**
                 * Oculta o menu 'cart', e direciona para o carrinho.
                 */
                $mdSidenav("cart").close();
                $state.go(category);
            } else {
                $state.go(
                    "section.showcase",
                    { sectionUrl: category },
                    { reload: true }
                );
                toggleSidenav("left");
            }
        }

        function logout(from) {
            Loja.Auth.logout().then(function(r) {
                $state.go("home");
                if (from == "sidenav" && ctrl.checkMedia("xs"))
                    toggleSidenav("left");
            });
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
                    controller: function($mdDialog) {
                        var ctrl = this;
                        ctrl.newsletter = {
                            firstname: "",
                            lastname: "",
                            email: "",
                            phone: ""
                        };

                        ctrl.cancel = function() {
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
                .then(function(answer) {
                    toast.message("Você está cadastrado em nossa Newsletter!");
                });
        }

        function openSectionFilters() {
            toggleSidenav("left");
            $timeout(function() {
                toggleSidenav("filters");
            }, 1000);
        }

        function searchSubmit() {
            toggleSubHeader(false);
            if(ctrl.search) $state.go("search", { search: ctrl.search });
        }

        function searchTyping() {
            var limit = 5;

            function _configureString(value) {
                return removeDiacritics(value.trim().toLowerCase());
            }
            function _getSearchItems() {
                ctrl.searchLoading = true;
                Loja.Store.items({
                    name_nd: "%" + _configureString(ctrl.search) + "%"
                }).then(
                    function(r) {
                        ctrl.searchLoading = false;
                        ctrl.searchItems = r.data.data;
                        ctrl.searchItemsFiltered = angular
                            .copy(ctrl.searchItems)
                            .slice(0, limit);
                        ctrl.searchEmpty =
                            ctrl.searchItemsFiltered.length == 0 ? true : false;
                    },
                    function(err) {
                        ctrl.searchLoading = false;
                        ctrl.searchItems = [];
                        ctrl.searchItemsFiltered = angular.copy(
                            ctrl.searchItems
                        );
                        ctrl.searchEmpty =
                            ctrl.searchItemsFiltered.length == 0 ? true : false;
                    }
                );
            }

            if (ctrl.search && ctrl.search.trim().length == 3) {
                _getSearchItems();
            } else if (ctrl.search && ctrl.searchItems.length) {
                ctrl.searchItemsFiltered = $filter("filter")(
                    angular.copy(ctrl.searchItems),
                    { name_nd: _configureString(ctrl.search) }
                ).slice(0, limit);
                ctrl.searchEmpty =
                    ctrl.searchItemsFiltered.length == 0 ? true : false;
            }

            if (ctrl.search && ctrl.search.trim().length >= 3)
                ctrl.toggleSubHeader("search");
        }

        function sign(from) {
            if (!ctrl.user()) {
                Loja.Auth.sign("user");
            } else {
                $state.go("user", { actual: from });
            }

            if (from == "sidenav" && ctrl.checkMedia("xs"))
                toggleSidenav("left");
        }

        function subMenuBanner() {
            if (ctrl.subMenu)
                return ctrl.subMenuBanners[ctrl.subMenu.category] || false;

            return false;
        }

        function subMenuItems(number) {
            if (
                !$rootScope.sections ||
                !$rootScope.sections.length ||
                !ctrl.subMenu
            )
                return [];

            var limit = 9,
                start = number * limit;

            var categories = (
                lodash.get(
                    lodash.find($rootScope.sections, {
                        name: ctrl.subMenu.name
                    }),
                    "subSections"
                ) || []
            ).filter(function(v) {
                return v.tagsGroup == "Categorias";
            });
            return $filter("orderBy")(categories, "name").slice(
                start,
                start + limit
            );
        }

        function toggleSidenav(component, action) {
            if (component == "cart") {
                if ($state.$current.name == "cart" && !ctrl.cartSideNavIsOpen)
                    return;

                if (action == "open" && !ctrl.cartSideNavIsOpen) {
                    ctrl.cartSideNavIsOpen = true;
                    $mdSidenav(component).open();
                }

                if (action == "close") {
                    $mdSidenav(component).close();
                    $timeout(function() {
                        ctrl.cartSideNavIsOpen = false;
                    }, 1000);
                }
            } else {
                $mdSidenav(component).toggle();
            }
        }

        function toggleSubHeader(type, section) {
            $timeout(function() {
                if (
                    ctrl.subHeader == "search" &&
                    type == "submenu" &&
                    ctrl.searchItemsFiltered.length
                )
                    return;

                ctrl.subHeader = type || false;
                ctrl.subMenu = section || false;
            }, 100);
        }

        // Ao mudar de state
        $rootScope.$on("$stateChangeSuccess", function(
            event,
            toState,
            toParams,
            fromState,
            fromParams,
            options
        ) {
            angular
                .element(document.querySelector("#Content"))
                .scrollToElementAnimated(document.querySelector("#container"));
            window.dataLayer.push({
                event: "pageView",
                action: toParams.sectionUrl
            });
        });

        $scope.$watch(
            function() {
                return ctrl.title;
            },
            function(title, oldValue, scope) {
                $rootScope.pageTitle = title.title
                    ? title.title + " | Milênio Móveis"
                    : "Milênio Móveis";
            }
        );
    });
};
