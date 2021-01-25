// Node Modules
var angular = require("angular");
var angularAnimate = require("angular-animate");
var angularAria = require("angular-aria");
var angularBrFilters = require("angular-br-filters");
var angularCompareTo = require("angularjs-compare-to-directive");
var angularInputMasks = require("angular-input-masks");
var angularMaterial = require("angular-material");
var angularMessages = require("angular-messages");
var angularScroll = require("angular-scroll");
var angularScrollWatch = require("angular-scroll-watch");
var angulartics = require("angulartics");
var angularticsGTM = require("angulartics-google-tag-manager");
var angularUiMask = require("angular-ui-mask");
var angularUiRouter = require("angular-ui-router");
var angularUiRouterStateEvents = require("ng-ui-router-state-events");
var lojainteligente = require("./lojainteligente");
var ngLocale = require("./modules/angular-locale_pt-br.js");
var ngLodash = require("ng-lodash");
var ocLazyLoad = require("oclazyload");
var ngSanitize = require("angular-sanitize");

var LojaInteligenteConfig = require("./lojainteligente.config.js"); // Configurações da LojaInteligente

var ngModule = angular
    .module("mileniomoveis", [
        angularAnimate,
        angularAria,
        angularBrFilters,
        angularInputMasks,
        "angulartics",
        "angulartics.google.tagmanager",
        "compareField",
        angularMaterial,
        angularMessages,
        angularScroll,
        angularScrollWatch,
        angularUiMask,
        "ui.router.state.events",
        lojainteligente,
        "ngLocale",
        "ngLodash",
        ocLazyLoad,
        "ui.router",
        ngSanitize
    ])
    .config(function($urlRouterProvider, $locationProvider, LojaProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/");

        // Define Endpoint de conexão à API LojaInteligente
        LojaProvider.endpoint(LojaInteligenteConfig.endpoint);

        // Conecta à API LojaInteligente
        LojaProvider.auth(
            LojaInteligenteConfig.username,
            LojaInteligenteConfig.password,
            LojaInteligenteConfig.id,
            LojaInteligenteConfig.token
        );
    })
    .run([
        "$rootScope",
        "$state",
        "Loja",
        "$location",
        function($rootScope, $state, Loja, $location) {
            Loja.Checkout.utms($location.search());

            // Conecta à API da LojaInteligente
            Loja.connect().then(function(response) {
                $rootScope.$on("$stateChangeError", function(
                    event,
                    toState,
                    toParams,
                    fromState,
                    fromParams,
                    error
                ) {
                    switch (error) {
                        case "AUTH_REQUIRED":
                        case "FORBIDDEN":
                        case "UNAUTHORIZED":
                            $state.go("home");
                            break;
                    }
                });
            });
        }
    ]);

// Dependências do App
require("./directives")(ngModule); // Directives

//Routes
require("./home/home.routes.js")(ngModule); //Home
require("./search/search.routes.js")(ngModule); //Search
require("./section/section.routes.js")(ngModule); //Section
require("./product/product.routes.js")(ngModule); //Product
require("./user/user.routes.js")(ngModule); //User
require("./about/about.routes.js")(ngModule); //About
require("./contact/contact.routes.js")(ngModule); //Contact
require("./cart/cart.routes.js")(ngModule); //Cart
require("./policies/policies.routes.js")(ngModule); //Cart

//Controllers
require("./main/main.controller.js")(ngModule); // Main Controller
require("./components/li-card-product/li-card-add-dialog.controller.js")(
    ngModule
); // Title
require("./components/li-card-showcase/li-card-showcase-dialog.controller.js")(ngModule); // Showcase Dialog

// Components
require("./components/toast/toast.js")(ngModule); // Toast
require("./components/milenio-title/milenio-title.directive.js")(ngModule); // Title
require("./components/small-title/small-title.directive.js")(ngModule); // Small Title
require("./components/li-items-list/li-items-list.directive.js")(ngModule); // Li Items
require("./components/li-items-filter/li-items-filter.directive.js")(ngModule); // Li Items Filter
require("./components/li-stamp/li-stamp.directive.js")(ngModule); // Li Stamp
require("./components/addressesList/addresses-list.directive.js")(ngModule); // Addresses List
require("./components/addressForm/address-form.directive.js")(ngModule); // Addresses Form
require("./components/ordersList/orders-list.directive.js")(ngModule); // Addresses Form
require("./components/li-card-product/li-card-product.directive.js")(ngModule); // Card Product
require("./components/li-card-showcase/li-card-showcase.directive.js")(ngModule); // Card Showcase
require("./components/li-product-carousel/li-product-carousel.directive.js")(ngModule); // Product Carousel
require("./components/newsletter-dialog/newsletter-form.directive.js")(
    ngModule
); // Newsletter Form
require("./components/li-product-list/li-product-list.directive.js")(ngModule); // Product Details
require("./components/li-product-details/li-product-details.directive.js")(
    ngModule
); // Product Details
require("./components/quote-list/quote-list.directive.js")(ngModule); // Quote List
require("./lojainteligente/directives/mask-fix.directive.js")(ngModule);

// Factory
require("./components/item-checkout/item-checkout.factory.js")(ngModule); // Toast

//Theme Config
require("./theme.config.js")(ngModule);

// CSS
require("../node_modules/angular-material/angular-material.min.css"); // CSS Angular-Material
require("./icons.scss"); // Material Icons
require("./ng-animation.css"); // ngAnimation
require("./variables.scss"); // Variables Sass
require("./app.sass"); // App Sass
