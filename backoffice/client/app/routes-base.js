"use strict";

angular
    .module("fuseapp")

    .config(function(
        $urlRouterProvider,
        $locationProvider,
        $stateProvider,
        msNavigationServiceProvider
    ) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.when("/", "/dashboard");
        $urlRouterProvider.otherwise("/dashboard");

        msNavigationServiceProvider.saveItem("dashboard", {
            title: "Dashboard",
            icon: "icon-tile-four",
            weight: 1,
            state: "app.dashboard"
        });

        msNavigationServiceProvider.saveItem("funnel", {
            title: "Orçamentos",
            icon: "icon-filter",
            weight: 2,
            state: "app.funnel"
        });

        msNavigationServiceProvider.saveItem("orders", {
            title: "Pedidos",
            icon: "icon-clipboard-check",
            weight: 3,
            state: "app.orders"
        });

        // Administração
        msNavigationServiceProvider.saveItem("adm", {
            title: "ADMINISTRAÇÃO",
            group: true,
            weight: 4,
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin"
                ]);
            }
        });

        msNavigationServiceProvider.saveItem("adm.companies", {
            title: "Empresas",
            icon: "icon-store",
            weight: 1,
            state: "app.adm-companies",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), "super-admin");
            }
        });

        msNavigationServiceProvider.saveItem("adm.plans", {
            title: "Planos",
            icon: "icon-briefcase",
            weight: 1,
            state: "app.adm-plans",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), ["super-admin"]);
            }
        });

        msNavigationServiceProvider.saveItem("adm.users", {
            title: "Usuários",
            icon: "icon-account-box",
            weight: 1,
            state: "app.adm-users",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin"
                ]);
            }
        });

        msNavigationServiceProvider.saveItem("adm.affiliates", {
            title: "Decoradores",
            icon: "icon-clipboard-account",
            weight: 1,
            state: "app.adm-affiliates",
            hidden: function() {
                return (
                    !Roles.userIsInRole(Meteor.userId(), [
                        "super-admin",
                        "admin"
                    ]) ||
                    _.get(Meteor.user().profile, "company.companyId") !=
                        "T8b7jMLWibW2sjAo6"
                );
            }
        });

        msNavigationServiceProvider.saveItem("store", {
            title: "LOJA",
            group: true,
            weight: 4,
            hidden: function() {
                return (
                    !Roles.userIsInRole(Meteor.userId(), [
                        "super-admin",
                        "admin",
                        "salesman",
                        "maintenance",
                        "expedition",
                        "affiliate"
                    ]) ||
                    (Meteor.user().profile.permissions
                        ? !(
                              Meteor.user().profile.permissions.indexOf(
                                  "store"
                              ) > -1
                          )
                        : false)
                );
            }
        });

        msNavigationServiceProvider.saveItem("store.banners", {
            title: "Banners",
            icon: "icon-blinds",
            weight: 1,
            state: "app.store-banners",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance"
                ]);
            }
        });

        msNavigationServiceProvider.saveItem("store.costumers", {
            title: "Clientes",
            icon: "icon-account-multiple",
            weight: 1,
            state: "app.store-costumers",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "salesman",
                    "expedition",
                    "affiliate"
                ]);
            }
        });

        msNavigationServiceProvider.saveItem("costumers", {
            title: "Clientes",
            icon: "icon-account-multiple",
            weight: 1,
            state: "app.store-costumers",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), ["affiliate"]);
            }
        });

        msNavigationServiceProvider.saveItem("store.cupons", {
            title: "Cupons Promocionais",
            icon: "icon-ticket",
            weight: 1,
            state: "app.store-cupons",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), "admin");
            }
        });

        msNavigationServiceProvider.saveItem("store.shippingSettings", {
            title: "Faixa de Ceps",
            icon: "icon-map-marker-radius",
            weight: 1,
            state: "app.store-shippingSettings",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), "admin");
            }
        });

        msNavigationServiceProvider.saveItem("store.environments", {
            title: "Ambientes",
            icon: "icon-bank",
            weight: 1,
            state: "app.store-environments",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition"
                ]);
            }
        });

        msNavigationServiceProvider.saveItem("store.items", {
            title: "Itens",
            icon: "icon-dropbox",
            weight: 1,
            state: "app.store-items",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition"
                ]);
            }
        });

        msNavigationServiceProvider.saveItem("store.sections", {
            title: "Seções",
            icon: "icon-sitemap",
            weight: 1,
            state: "app.store-sections",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance"
                ]);
            }
        });

        msNavigationServiceProvider.saveItem("store.status", {
            title: "Status de pedido",
            icon: "icon-fast-forward",
            weight: 1,
            state: "app.store-status",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), "admin");
            }
        });

        msNavigationServiceProvider.saveItem("store.tags", {
            title: "Tags",
            icon: "icon-tag",
            weight: 1,
            state: "app.store-tags",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance"
                ]);
            }
        });

        msNavigationServiceProvider.saveItem("store.terms", {
            title: "Termos de uso",
            icon: "icon-clipboard-text",
            weight: 1,
            state: "app.store-terms",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), "admin");
            }
        });

        msNavigationServiceProvider.saveItem("store.settings", {
            title: "Configurações",
            icon: "icon-cog",
            weight: 1,
            state: "app.store-settings",
            hidden: function() {
                return !Roles.userIsInRole(Meteor.userId(), "admin");
            }
        });
    })
    .run([
        "$rootScope",
        "$state",
        "$mdToast",
        function($rootScope, $state, $mdToast) {
            $rootScope.$on("$stateChangeStart", function(evt, to, params) {
                if (to.redirectTo) {
                    evt.preventDefault();
                    $state.go(to.redirectTo, params, { location: "replace" });
                }
            });

            // $rootScope.$on('$stateChangeSuccess', function(event) {
            //     _agile.track_page_view();
            // });

            $rootScope.$on("$stateChangeError", function(
                event,
                toState,
                toParams,
                fromState,
                fromParams,
                error
            ) {
                console.log("erro", error)
                switch (error) {
                    case "NOT_FOUND":
                    case "AUTH_REQUIRED":
                    case "FORBIDDEN":
                    case "UNAUTHORIZED":
                        $mdToast.show(
                            $mdToast
                                .simple()
                                .content(
                                    "Você não tem permissão para acessar aquela área."
                                )
                                .position("top right")
                                .hideDelay(4000)
                        );
                        $state.go("app.login");
                        break;
                    case "LOGGED":
                        $state.go("app.dashboard");
                        break;
                    case "NO_DATA":
                        $mdToast.show(
                            $mdToast
                                .simple()
                                .content("ERRO: Nenhum dado foi recebido.")
                                .position("top right")
                                .hideDelay(4000)
                        );
                        break;
                }
            });
        }
    ]);
