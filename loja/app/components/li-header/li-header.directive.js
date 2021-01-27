module.exports = function(ngModule) {
    require("./li-header.sass");

    ngModule.directive("liHeader", function() {
        var removeDiacritics = require("diacritics").remove;

        return {
            restrict: "EA",
            template: require("./li-header.view.html"),
            replace: true,
            scope: {
                loja: "="
            },
            controllerAs: "vm",
            controller: function(
                $filter, $mdMedia, $mdSidenav, $state, $scope, $rootScope, $timeout, lodash
            ) {
                var vm = this;
                const Loja = $scope.loja

                vm.user = Loja.Auth.me;
                vm.cart = Loja.Checkout.cart;

                //Variables
                vm.sections = [
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
                        category: "area-interna",
                        icon: "/assets/lojainteligente/imgs/sofa.svg",
                        name: "Área Interna"
                    }
                ];

                vm.cartSideNavIsOpen = false;
                vm.search = "";
                vm.searchEmpty = true;
                vm.searchItems = [];
                vm.searchItemsFiltered = false;
                vm.subHeader = false;
                vm.subMenu = false;
                vm.subMenuBanners = {};
                vm.subSearch = false;

                $rootScope.sections = [];

                //Methods
                vm.openSectionFilters = openSectionFilters;
                vm.searchSubmit = searchSubmit;
                vm.searchTyping = searchTyping;
                vm.section = getSection;
                vm.sign = sign;
                vm.subMenuBanner = subMenuBanner;
                vm.subMenuItems = subMenuItems;
                vm.toggleSidenav = toggleSidenav;
                vm.toggleSubHeader = toggleSubHeader;
                vm.goTo = goTo;
                vm.logout = logout;

                //Functions
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
                    vm.sections.forEach(function(section) {
                        Loja.Store.banners("menu-" + section.category).then(
                            function(r) {
                                var banners = lodash.get(r, "data.data.0.banners");
        
                                if (banners)
                                    vm.subMenuBanners[section.category] = banners[0];
                            },
                            function(err) {
                                console.error(err);
                            }
                        );
                    });
                }
                getSubMenuBanners();

                function openSectionFilters() {
                    toggleSidenav("left");
                    $timeout(function() {
                        toggleSidenav("filters");
                    }, 1000);
                }

                function searchSubmit() {
                    toggleSubHeader(false);
                    if(vm.search) $state.go("search", { search: vm.search });
                }
        
                function searchTyping() {
                    var limit = 5;
        
                    function _configureString(value) {
                        return removeDiacritics(value.trim().toLowerCase());
                    }
                    function _getSearchItems() {
                        vm.searchLoading = true;
                        Loja.Store.items({
                            name_nd: "%" + _configureString(vm.search) + "%"
                        }).then(
                            function(r) {
                                vm.searchLoading = false;
                                vm.searchItems = r.data.data;
                                vm.searchItemsFiltered = angular
                                    .copy(vm.searchItems)
                                    .slice(0, limit);
                                vm.searchEmpty =
                                    vm.searchItemsFiltered.length == 0 ? true : false;
                            },
                            function(err) {
                                vm.searchLoading = false;
                                vm.searchItems = [];
                                vm.searchItemsFiltered = angular.copy(
                                    vm.searchItems
                                );
                                vm.searchEmpty =
                                    vm.searchItemsFiltered.length == 0 ? true : false;
                            }
                        );
                    }
        
                    if (vm.search && vm.search.trim().length == 3) {
                        _getSearchItems();
                    } else if (vm.search && vm.searchItems.length) {
                        vm.searchItemsFiltered = $filter("filter")(
                            angular.copy(vm.searchItems),
                            { name_nd: _configureString(vm.search) }
                        ).slice(0, limit);
                        vm.searchEmpty =
                            vm.searchItemsFiltered.length == 0 ? true : false;
                    }
        
                    if (vm.search && vm.search.trim().length >= 3)
                        vm.toggleSubHeader("search");
                }
        
                function sign(from) {
                    if (!vm.user()) {
                        Loja.Auth.sign("user");
                    } else {
                        $state.go("user", { actual: from });
                    }
        
                    if (from == "sidenav" && checkMedia("xs"))
                        toggleSidenav("left");
                }

                
                function subMenuBanner() {
                    if (vm.subMenu)
                        return vm.subMenuBanners[vm.subMenu.category] || false;

                    return false;
                }

                function subMenuItems(number) {
                    if (
                        !$rootScope.sections ||
                        !$rootScope.sections.length ||
                        !vm.subMenu
                    )
                        return [];
        
                    var limit = 6,
                        start = number * limit;
        
                    var categories = (
                        lodash.get(
                            lodash.find($rootScope.sections, {
                                name: vm.subMenu.name
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

                function toggleSubHeader(type, section) {
                    $timeout(function() {
                        if (
                            vm.subHeader == "search" &&
                            type == "submenu" &&
                            vm.searchItemsFiltered.length
                        )
                            return;
        
                        vm.subHeader = type || false;
                        vm.subMenu = section || false;
                    }, 100);
                }

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
                        if (from == "sidenav" && checkMedia("xs"))
                            toggleSidenav("left");
                    });
                }

                function toggleSidenav(component, action) {
                    if (component == "cart") {
                        if ($state.$current.name == "cart" && !vm.cartSideNavIsOpen)
                            return;
        
                        if (action == "open" && !vm.cartSideNavIsOpen) {
                            vm.cartSideNavIsOpen = true;
                            $mdSidenav(component).open();
                        }
        
                        if (action == "close") {
                            $mdSidenav(component).close();
                            $timeout(function() {
                                vm.cartSideNavIsOpen = false;
                            }, 1000);
                        }
                    } else {
                        $mdSidenav(component).toggle();
                    }
                }

                function checkMedia(size) {
                    return $mdMedia(size);
                }
            }
        };
    });
};
