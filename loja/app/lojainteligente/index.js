module.exports = "LojaInteligente";

// Modules
require("./modules/angular-credit-cards.js"); // Angular CreditCards
require("./modules/angular-flippy.js"); // Angular Flippy

var _ = require("lodash");

var LojaInteligenteModule = angular
    .module("LojaInteligente", ["credit-cards", "angular-flippy"])
    .provider("Loja", function() {
        var api = {
            auth: {
                authToken: null,
                userId: null
            },
            endpoint: "https://api.lojainteligente.com",
            headers: {},
            credentials: {
                email: null,
                password: null,
                id: null,
                token: null
            },
            settings: null,
            user: {}
        };

        // Loading
        var loadingStart = function() {},
            loadingStop = function() {};

        // Recebe os dados de autenticação da Loja
        this.auth = function(email, password, _id, token) {
            api.credentials.email = email;
            api.credentials.password = password;
            api.auth.authToken = api.credentials.token = token;
            api.auth.userId = api.credentials.id = _id;
        };

        // Recebe Endpoint a ser utilizado pela API
        this.endpoint = function(endpoint) {
            api.endpoint = endpoint;
        };

        this.$get = function(
            $rootScope,
            $cacheFactory,
            $http,
            $mdDialog,
            $q,
            $state,
            $timeout,
            $window,
            $mdMedia,
            toast,
            lodash
        ) {
            // Gerencia funções do localStorage mesmo quando não disponível
            // Fake Local Storage
            var localStorage = {
                data: {},
                fake: false,
                getItem: function(prop) {
                    if (localStorage.fake)
                        return localStorage.data[prop] || null;

                    return $window.localStorage.getItem(prop);
                },
                setItem: function(prop, value) {
                    localStorage.data[prop] = value;

                    if (!localStorage.fake)
                        $window.localStorage.setItem(prop, value);
                },
                removeItem: function(prop) {
                    delete localStorage.data[prop];

                    if (!localStorage.fake)
                        $window.localStorage.removeItem(prop);
                },
                test: function() {
                    try {
                        localStorage.setItem("localStorage", 1);
                        localStorage.removeItem("localStorage");
                    } catch (e) {
                        localStorage.fake = true;
                    }
                }
            };

            localStorage.test();

            // Private API
            // Pega dados de autenticação no localStorage
            var auth =
                angular.fromJson(localStorage.getItem("auth")) || api.auth;

            // Faz as requisções na API
            function req(method, action, data, params, noCache) {
                // Informa APP que está carregando
                loadingStart();

                // noCache: pega info atualiza no servidor
                if (noCache) params.t = Date.now();

                // Segura requisição se ainda não está autenticado
                if (
                    (api.auth.authToken && api.settings) ||
                    (api.auth.authToken && action == "/store/settings") ||
                    action == "/auth/login" ||
                    action == "/auth/check"
                ) {
                    return $q(function(resolve, reject) {
                        $http({
                            cache: action != "/auth/chek", // Não salva cache de '/auth/check'
                            data: data,
                            headers: api.headers,
                            method: method,
                            params: params,
                            url: api.endpoint + action
                        }).then(
                            function(r) {
                                // Informa APP que terminou de carregar
                                loadingStop();

                                resolve(r);
                            },
                            function(err) {
                                // Informa APP que terminou de carregar
                                loadingStop();

                                reject(err);
                            }
                        );
                    });
                } else {
                    return $timeout(function() {
                        return req(method, action, data, params, noCache);
                    }, 200);
                }
            }

            // Define HEADERS de autenticação padrões em todas as requisições
            function setAuth(data) {
                // Limpa Cache da API
                $cacheFactory.get("$http").removeAll();

                // Define autenticação
                if (data) {
                    // Grava 'auth' no localStorage
                    localStorage.setItem("auth", angular.toJson(data));
                    auth = data;

                    // Remove autenticação
                } else {
                    localStorage.removeItem("auth");

                    api.headers = {};

                    api.auth.authToken = api.credentials.token;
                    api.auth.userId = api.credentials.id;

                    auth = api.auth;
                }

                if (auth) {
                    api.headers = {
                        "X-Auth-Token": auth.authToken,
                        "X-User-Id": auth.userId
                    };

                    api.auth.authToken = auth.authToken;
                    api.auth.userId = auth.userId;
                }
            }

            // Define Api.User e identifica Customer no Checkout se necesário
            function setUser(user) {
                api.user = user;

                // Se for Customer
                // Atualiza checkout.customer
                if (API.Auth.permission("customer"))
                    API.Checkout.identify(api.user.profile);
            }

            // Public API
            var API = {};

            // Services
            API.Auth = {
                check: function(email) {
                    return req("POST", "/auth/check", {
                        email: email
                    });
                },
                identify: function(email) {
                    return $q(function(resolve, reject) {
                        req("GET", "/customers/check", null, {
                            email: email
                        }).then(
                            function(r) {
                                API.Checkout.identify(r.data.data);

                                resolve(r);
                            },
                            function(err) {
                                API.Checkout.identify(
                                    err.data.customer || {
                                        profile: {
                                            email: email
                                        }
                                    }
                                );

                                reject(err);
                            }
                        );
                    });
                },
                login: function(email, password) {
                    return $q(function(resolve, reject) {
                        req("POST", "/auth/login", {
                            email: email,
                            password: password
                        }).then(
                            function(r) {
                                // Atualiza HEADERS de autenticação
                                setAuth(r.data.data);

                                // Grava dados do usuário
                                req("GET", "/auth/me").then(
                                    function(r) {
                                        setUser(r.data.data);
                                    },
                                    function(err) {
                                        console.log(err);
                                    }
                                );

                                resolve(r);
                            },
                            function(err) {
                                //setAuth();
                                reject(err);
                            }
                        );
                    });
                },
                logout: function() {
                    return $q(function(resolve, reject) {
                        req("POST", "/auth/logout").then(
                            function(r) {
                                // Atualiza HEADERS de autenticação
                                setAuth();

                                // Remove dados do usuário
                                api.user = {};

                                // Loga novamente com API
                                API.connect().then(
                                    function(r) {
                                        resolve(r);
                                    },
                                    function(err) {
                                        reject(err);
                                    }
                                );
                            },
                            function(err) {
                                // Atualiza HEADERS de autenticação
                                setAuth();

                                // Remove dados do usuário
                                api.user = {};

                                // Loga novamente com API
                                API.connect().then(
                                    function(r) {
                                        resolve(r);
                                    },
                                    function(err) {
                                        reject(err);
                                    }
                                );
                            }
                        );
                    });
                },
                me: function(user) {
                    return API.Auth.permission("customer") ? api.user : false;
                },
                customerUpdate: function(data) {
                    return req("PUT", "/auth/me", data);
                },
                meCustomer: function(data) {
                    return req("GET", "/auth/me", {}, {}, true);
                },
                passwordChange: function(password, newPassword) {
                    return req("POST", "/auth/password_change", {
                        password: password,
                        newPassword: newPassword
                    });
                },
                permission: function(permission) {
                    return (
                        api.user.roles &&
                        api.user.roles.indexOf(permission) > -1
                    );
                },
                register: function(user) {
                    return $q(function(resolve, reject) {
                        req("POST", "/auth/register", user).then(
                            function(r) {
                                // Atualiza HEADERS de autenticação
                                setAuth(r.data.data);

                                // Grava dados do usuário
                                req("GET", "/auth/me").then(
                                    function(r) {
                                        setUser(r.data.data);
                                    },
                                    function(err) {
                                        console.log(err);
                                    }
                                );

                                resolve(r);
                            },
                            function(err) {
                                reject(err);
                            }
                        );
                    });
                },
                newsletterRegister: function(user) {
                    return req("POST", "/auth/register", user);
                },
                sign: function(redirect, ev, hide, cancel) {
                    $mdDialog
                        .show({
                            controller: "LoginCtrl as vm",
                            template: require("./login/login.view.html"),
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: false,
                            fullscreen: true,
                            locals: {
                                redirect: redirect
                            },
                            bindToController: true
                        })
                        .then(
                            function(answer) {
                                if (hide) hide();
                                if (redirect != "capture") $state.go(redirect);
                            },
                            function() {
                                if (cancel) cancel();
                            }
                        );
                }
            };

            // Checkout
            var checkoutLoaded = false;

            var checkout = {
                    cart: {
                        discount: 0,
                        installmentsMax: 1,
                        items: [],
                        itemsCount: 0,
                        itemsTotal: 0,
                        shippingPrice: 0,
                        total: 0
                    },
                    customer: {},
                    events: [],
                    shipping: {},
                    meta: {
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                },
                eventsNames = [
                    "cart_started",
                    "checkout_started",
                    "customer_identified",
                    "item_added",
                    "item_removed",
                    "item_quant_changed",
                    "shipping_informed",
                    "payment_attempt",
                    "payment_denied",
                    "payment_completed"
                ];

            function callGA(ev, info) {
                switch(ev) {
                    case "checkout_started":
                        ga('ec:setAction', 'begin_checkout');
                    break;
                    case "item_added":
                        ga('ec:addProduct', { 'id': info.itemId,  'name': info.name });
                        ga('ec:setAction', 'add_to_cart');
                    break;
                    case "item_removed":
                        ga('ec:addProduct', { 'id': info.itemId,  'name': info.name });
                        ga('ec:setAction', 'remove_from_cart');
                    break;
                    case "payment_completed":
                        ga('ec:setAction','checkout', { 'step': 1,  'option': info.method });
                    break;
                }
            }

            // Grava evento no 'checkout.events'
            function event(e, info) {
                // Se evento exisitr
                if (eventsNames.indexOf(e) > -1) {
                    callGA(e, info);
                    if (checkout.events) {
                        checkout.events.push({
                            type: e,
                            time: new Date(),
                            info: info || ""
                        });
                    } else {
                        checkout.events = [];
                        checkout.events.push({
                            type: e,
                            time: new Date(),
                            info: info || ""
                        });
                    }
                }

                saveCheckout();
            }

            function getCheckout(checkoutId) {
                // Confere se exite 'checkout' no localStorage
                // Se existir, recupera 'checkout'
                var checkoutStorage = angular.fromJson(
                    localStorage.getItem("checkout")
                );

                if (checkoutStorage) checkout = checkoutStorage;

                checkoutLoaded = true;

                // Se 'checkout' tiver _id, atualiza com dados do DB
                if (checkout._id) {
                    req("GET", "/checkouts/" + checkoutId || checkout._id).then(
                        function(r) {
                            setCheckout(r.data.data);
                        },
                        function(err) {
                            console.log(err);
                        }
                    );
                }
            }
            getCheckout();

            // Descobre IP do usuário e grva em 'checkout.meta.ip'
            function ip() {
                // $http({
                //     headers: {},
                //     method: "GET",
                //     url: "//freegeoip.net/json/"
                // }).then(function(r) {
                //     checkout.meta.ip = r.data.ip;
                // });
            }

            function itemsTotal() {
                var total = 0;

                angular.forEach(checkout.cart.items, function(item) {
                    total +=
                        (item.options.salesPrice || item.options.price) *
                        item.quant;
                });

                return total;
            }

            function recalculateShipping() {
                if (checkout.internal) return checkout.cart.shippingPrice;

                //calcula o valor do cep baseado no percentual
                var shippingPrice =
                    api.shipping && api.shipping.percent
                        ? (checkout.cart.itemsTotal * api.shipping.percent) /
                          100
                        : 0;

                //se valor do pedido for maior que frete grátis, não cobra frete
                if (
                    api.shipping &&
                    api.shipping.minValue <= checkout.cart.itemsTotal &&
                    api.shipping.minValue
                )
                    return 0;

                // se ainda após o percentual, o valor não atingir o frete mínimo, cobra frete mínimo
                if (api.shipping && shippingPrice < api.shipping.price)
                    shippingPrice = api.shipping.price || 0;

                return shippingPrice;
            }

            function resetCart() {
                // Reseta carrinho
                delete checkout._id;

                checkout.cart = {
                    discount: 0,
                    installmentsMax: 1,
                    items: [],
                    itemsCount: 0,
                    itemsTotal: 0,
                    shippingPrice: 0,
                    total: 0
                };
                checkout.events = [];
                checkout.shipping = {};
                checkout.meta = {
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                setCheckout(checkout);
            }

            function checkDiscount(coupon) {
                if (!coupon) coupon = checkout.cart.coupon;

                if (
                    (!coupon || !coupon.discountType) &&
                    !checkout.cart.discount
                )
                    return 0;

                if (!checkout.cart.discountType) {
                    checkout.cart.discountType = coupon.discountType;
                    checkout.cart.discount = coupon.discount;
                }

                return checkout.cart.discount;
            }

            function calcDiscount() {
                return checkout.cart.discountType == "$"
                    ? checkout.cart.discount
                    : (checkout.cart.itemsTotal * checkout.cart.discount) / 100;
            }

            function saveCart() {
                var cart = checkout.cart;

                checkout.cart.itemsCount = Object.keys(cart.items).length;
                checkout.cart.itemsTotal = itemsTotal();
                checkout.cart.discount = checkDiscount();
                if (!checkout.cart.internal) {
                    checkout.cart.total =
                        cart.itemsTotal - calcDiscount() + cart.shippingPrice;
                    checkout.cart.shippingPrice = recalculateShipping();
                }
            }

            function saveCheckout(preventUpdate, callback) {
                // Calcula valores do carrinho
                saveCart();

                // Grava horário da última atualização
                if (checkout.meta) checkout.meta.updatedAt = new Date();
                else {
                    checkout.meta = [];
                    checkout.meta.updatedAt = new Date();
                }

                localStorage.setItem("checkout", angular.toJson(checkout));

                if (
                    (checkout._id || !angular.equals(checkout.customer, {})) &&
                    !preventUpdate
                ) {
                    req("POST", "/checkouts", checkout).then(
                        function(r) {
                            setCheckout(r.data.data);
                            if (callback) callback(r.data.data);
                        },
                        function(err) {
                            if (
                                err.status == 403 &&
                                err.data.message ==
                                    "Pedido já realizado, não pode ser alterado."
                            )
                                resetCart();

                            console.log(err);
                        }
                    );
                }
            }

            function setCheckout(data) {
                checkout = data;

                // if (checkout.affiliate) {
                //     $rootScope.affiliate = {
                //         affiliate: checkout.affiliate,
                //         customer: checkout.customer
                //     };
                // }

                localStorage.setItem("checkout", angular.toJson(checkout));
            }

            function installmentsConfig() {
                // Vars
                var maxInstallments = api.settings.installments.maxInstallments,
                    minValueInstallments = api.settings.installments.min,
                    totalCart = checkout.cart.total,
                    times = 0,
                    value = 0,
                    calcInstallments;

                if (checkout.cart.internal) {
                    return {
                        times: checkout.cart.installmentsMax,
                        value:
                            checkout.cart.total / checkout.cart.installmentsMax
                    };
                } else {
                    /** Calcula o valor das parcelas no orçamento
                     * @param  {int} price - Recebe o valor total do carrinho
                     * @param  {int} maxTimes - Recebe o valor máxio de parcelas do sistema
                     * @param  {int} minValueTime - Recebe o valor mínimo de cada parcela do sistema
                     */
                    calcInstallments = function(price, maxTimes, minValueTime) {
                        //Se o item possui uma regra especifica, preserva-se a regra.
                        if (
                            checkout.cart.itemsCount == 1 &&
                            checkout.cart.items[0].installments
                        ) {
                            var installments = API.Store.itemInstallments(
                                checkout.cart.items[0] || {}
                            );

                            times = installments.times;
                            value = price / installments.times;
                        } else {
                            // Se não houver regra específica preserva-se a regra do item, até que se tenha um valor total que possa ser substítuída pela regra do sistema.
                            times = 1;
                            value = price;

                            for (var i = 1; i <= maxTimes; i++) {
                                if (price / i >= minValueTime) {
                                    times = i;
                                    value = price / i;
                                }
                            }
                        }
                    };

                    if (checkout.cart.items.length > 0)
                        calcInstallments(
                            totalCart,
                            maxInstallments,
                            minValueInstallments
                        );

                    return {
                        times: times,
                        value: value
                    };
                }
            }

            API.Checkout = {
                byId: function(checkoutId) {
                    return $q(function(resolve, reject) {
                        if (checkout._id != checkoutId)
                            req("GET", "/checkouts/" + checkoutId).then(
                                function(r) {
                                    setCheckout(r.data.data);
                                    resolve();
                                },
                                function(err) {
                                    console.log(err);
                                    reject();
                                }
                            );
                        else resolve();
                    });
                },
                budget: function(number, code, set) {
                    return req(
                        "GET",
                        "/checkouts/get/" + number + "/" + code
                    ).then(function(r) {
                        if (typeof set == "undefined" || set)
                            API.Checkout.setCheckout(r.data.data);
                    });
                },
                // Retorna carrinho
                cart: function() {
                    // Retorna carrinho
                    return checkout.cart;
                },
                // Retorna customer do carrinho
                checkoutCustomer: function() {
                    // Retorna carrinho
                    return checkout.customer;
                },
                // Retorna endereço do carrinho
                checkoutShipping: function() {
                    // Retorna carrinho
                    return checkout.shipping;
                },
                coupon: function(code) {
                    return $q(function(resolve, reject) {
                        API.Store.coupons(code).then(
                            function(r) {
                                // cria uma variavel com o resultado do cupom
                                var coupon = r.data.data;
                                // aplica o desconto no checkout
                                checkout.cart.discount = checkDiscount(coupon);
                                // salva o cupom no checkout
                                checkout.cart.coupon = coupon;
                                // gera o evento de cupom aplicado
                                event("coupon_applied", coupon);
                                resolve(r);
                            },
                            function(err) {
                                event("coupon_denied", code);
                                reject(err);
                            }
                        );
                    });
                },
                getShippings: function() {
                    // Retorna carrinho
                    return api.shipping;
                },
                getLastCheckout: function() {
                    return api.lastId;
                },
                isInternal: function() {
                    return checkout.internal;
                },
                itemInstallments: function(item) {
                    return $q(function(resolve, reject) {
                        if (!api.settings) {
                            req("GET", "/store/settings").then(
                                function(r) {
                                    api.settings = r.data.data;
                                    resolve(installmentsConfig());
                                },
                                function(err) {
                                    reject(err);
                                }
                            );
                        } else {
                            resolve(installmentsConfig());
                        }
                    });
                },
                // Adiciona item no carrinho
                itemAdd: function(
                    item,
                    quant,
                    customization,
                    option,
                    dialog,
                    index
                ) {
                    // Confere se o Carrinho já foi iniciado
                    if (angular.equals(checkout.cart.items, [])) {
                        // Salva evento
                        event("cart_started");
                        // Pega IP do usuário
                        ip();

                        var utms = localStorage.getItem("utms");
                        _.set(
                            checkout,
                            "meta.utms",
                            utms ? JSON.parse(utms) : {}
                        );
                    }

                    if (!checkout.cart.internal) {
                        /**
                         * Conferer se já existe algum item no carrinho com a mesma ID
                         */
                        if (
                            !lodash.find(checkout.cart.items, function(o) {
                                return o._id == item._id;
                            })
                        ) {
                            /**
                             * Adiciona o item ao carrinho
                             */
                            checkout.cart.items.push({
                                _id: item._id,
                                customizations: customization,
                                name: item.name,
                                name_nd: item.name_nd,
                                options: option,
                                quant: quant,
                                picture: item.pictures[0] || "",
                                url: item.url,
                                installments: item.installments,
                                total:
                                    (option.salesPrice || option.price) * quant
                            });

                            // Salva evento
                            event("item_added", {
                                itemId: item._id,
                                name: item.name
                            });

                            toast.message(
                                "Produto adicionado ao carrinho.",
                                2000
                            );
                        } else {
                            /**
                             * Recebe a index do item no carrinho caso exista algum com o mesmo id (o._id == item._id) && mesmas customizações (lodash.isEqual(o.customizations, customization) == true) && mesmas opções (lodash.isEqual(o.options, option) == true)
                             */
                            var itemOfCart = lodash.findIndex(
                                checkout.cart.items,
                                function(o) {
                                    return (
                                        o._id == item._id &&
                                        lodash.isEqual(
                                            o.customizations,
                                            customization
                                        ) == true &&
                                        lodash.isEqual(o.options, option) ==
                                            true
                                    );
                                }
                            );

                            /**
                             * Confere se foi encontrado alguma index de item do carrinho (-1 is undefined)
                             */
                            if (itemOfCart > -1) {
                                /**
                                 * Caso a requisição venha de um dialog e tenha sido requisitada da tela de orçamento, a quantidade do item é atualizada.
                                 */
                                if (dialog && $state.current.name == "cart") {
                                    checkout.cart.items[
                                        itemOfCart
                                    ].quant = quant;
                                    checkout.cart.items[itemOfCart].total =
                                        (option.salesPrice || option.price) *
                                        quant;

                                    // Salva o evento
                                    event("item_quant_changed", {
                                        itemId: item._id,
                                        name: item.name,
                                        oldQuant: item.quant,
                                        newQuant: quant
                                    });

                                    toast.message("Produto Atualizado");
                                } else {
                                    toast.message(
                                        "Você já possui um produto com essas cutomizações no seu carrinho."
                                    );
                                }
                            } else {
                                /**
                                 * Se for encontrado uma index == -1 (undefined)
                                 */
                                if (dialog && index) {
                                    checkout.cart.items[index].options = option;
                                    checkout.cart.items[
                                        index
                                    ].customizations = customization;
                                    checkout.cart.items[index].quant = quant;
                                    checkout.cart.items[index].total =
                                        (option.salesPrice || option.price) *
                                        quant;

                                    // Salva o evento
                                    event("item_quant_changed", {
                                        itemId: item._id,
                                        name: item.name,
                                        oldQuant: item.quant,
                                        newQuant: quant
                                    });

                                    toast.message("Produto Atualizado.");
                                } else {
                                    checkout.cart.items.push({
                                        _id: item._id,
                                        customizations: customization,
                                        name: item.name,
                                        name_nd: item.name_nd,
                                        options: option,
                                        quant: quant,
                                        picture: item.pictures[0] || "",
                                        url: item.url,
                                        installments: item.installments,
                                        total:
                                            (option.salesPrice ||
                                                option.price) * quant
                                    });

                                    // Salva evento
                                    event("item_added", {
                                        itemId: item._id,
                                        name: item.name
                                    });

                                    toast.message("Produto Adicionado.");
                                }
                            }
                        }

                        if (
                            checkout.cart.items.length == 1 &&
                            angular.equals(checkout.customer, {})
                        )
                            $timeout(function() {
                                API.Auth.sign("capture");
                            }, 3000);

                        $mdDialog.hide();
                    } else {
                        toast.message(
                            "Você possui um orçamento em andamento. Limpe o carrinho antes de inciar outro. "
                        );
                    }
                },
                itemQuantChange: function(item, quant) {
                    /**
                     * Recebe a index do item no carrinho caso exista algum com o mesmo id (o._id == item._id) && mesmas customizações (lodash.isEqual(o.customizations, customization) == true) && mesmas opções (lodash.isEqual(o.options, option) == true)
                     */
                    var indexInCart = lodash.findIndex(
                        checkout.cart.items,
                        function(o) {
                            return (
                                o._id == item._id &&
                                lodash.isEqual(
                                    o.customizations,
                                    item.customizations
                                ) == true &&
                                lodash.isEqual(o.options, item.options) == true
                            );
                        }
                    );

                    // Se o item existir no carrinho
                    if (checkout.cart.items[indexInCart]) {
                        var oldItem = checkout.cart.items[indexInCart],
                            oldQuant = oldItem.quant;

                        oldItem.quant = quant || 1;
                        oldItem.total =
                            (oldItem.options.salesPrice ||
                                oldItem.options.price) * oldItem.quant;

                        event("item_quant_changed", {
                            itemId: item._id,
                            name: item.name,
                            oldQuant: oldQuant,
                            newQuant: oldItem.quant
                        });
                    }
                },
                itemRemove: function(item, index) {
                    lodash.remove(checkout.cart.items, function(o) {
                        return (
                            o._id == item._id &&
                            lodash.isEqual(
                                o.customizations,
                                item.customizations
                            ) == true &&
                            lodash.isEqual(o.options, item.options) == true
                        );
                    });

                    event("item_removed", item._id);
                },
                identify: function(customer, affiliate) {
                    checkout.customer = customer;

                    if (affiliate) checkout.affiliate = affiliate;

                    event("customer_identified", customer);
                },
                pay: function(payment) {
                    event("payment_attempt", {
                        method: payment.method,
                        brand: payment.method,
                        number:
                            payment.number.substr(0, 6) +
                            "******" +
                            payment.number.substr(-4, 4),
                        holder: payment.holder,
                        installments: payment.installments
                    });

                    return $q(function(resolve, reject) {
                        req("POST", "/checkouts/" + checkout._id + "/payment", {
                            payment: payment
                        }).then(
                            function(r) {
                                event("payment_completed", {
                                    method: payment.method,
                                    brand: payment.method,
                                    number:
                                        payment.number.substr(0, 6) +
                                        "******" +
                                        payment.number.substr(-4, 4),
                                    holder: payment.holder,
                                    installments: payment.installments
                                });

                                // salva a url do boleto
                                if (payment.method == "Boleto Bradesco") {
                                    var url =
                                        r.data.data.transaction.urlPagamento;
                                    checkout.ticketUrl = url;
                                    api.lastId = checkout._id;
                                    saveCheckout(false, function() {
                                        resetCart();
                                        resolve(r);
                                    });
                                } else {
                                    resetCart();
                                    resolve(r);
                                }
                            },
                            function(err) {
                                event("payment_denied", {
                                    method: payment.method,
                                    brand: payment.method,
                                    number:
                                        payment.number.substr(0, 6) +
                                        "******" +
                                        payment.number.substr(-4, 4),
                                    holder: payment.holder,
                                    installments: payment.installments
                                });

                                reject(err);
                            }
                        );
                    });
                },
                payment: function(ev, hide, cancel) {
                    $state.go("checkout");
                },
                resetCart: resetCart,
                setCheckout: function(order) {
                    console.log("setCheckout");
                    checkout = order;
                    saveCheckout();
                },
                setCheckoutDocumentPhone: function(document, phone) {
                    console.log("setCheckoutPone");
                    checkout.customer.document = document;
                    checkout.customer.phone = phone;
                    saveCheckout();
                },
                setRecurrence: function(recurrence) {
                    // recebe dados de recorrência
                    checkout.recurrence = recurrence;

                    event("set_recurrence", recurrence);
                },
                start: function() {
                    event("checkout_started");

                    console.log("start");
                    return $q(function(resolve, reject) {
                        req("POST", "/checkouts", checkout).then(
                            function(r) {
                                checkout = r.data.data;

                                saveCheckout(true);

                                resolve();
                            },
                            function(err) {
                                reject(err);
                            }
                        );
                    });
                },
                shipping: function(shipping, zipcode, checkoutShipping) {
                    if (shipping) {
                        shipping.zipcode = zipcode;
                        api.shipping = shipping;
                        checkout.cart.shippingPrice = recalculateShipping();
                    } else {
                        checkout.shipping = checkoutShipping;
                    }

                    event("shipping_informed", shipping);
                },
                utms: function(params) {
                    var utms = _.reduce(
                        params,
                        (r, value, key) => {
                            if (key.match(/^utm/)) r[key] = value;
                            return r;
                        },
                        {}
                    );

                    if (!_.isEmpty(utms))
                        localStorage.setItem("utms", JSON.stringify(utms));
                }
            };

            API.Affiliate = {
                identify: function(affiliateId, customerId, checkoutId) {
                    return $q(function(resolve, reject) {
                        req(
                            "GET",
                            "/affiliates/identify",
                            null,
                            { affiliateId, customerId },
                            true
                        ).then(
                            function(r) {
                                API.Auth.logout();

                                if (checkoutId)
                                    API.Checkout.byId(checkoutId).then(
                                        function() {
                                            resolve(r);
                                        },
                                        function() {
                                            reject();
                                        }
                                    );
                                else {
                                    API.Checkout.resetCart();
                                    API.Checkout.identify(
                                        r.data.data.customer,
                                        r.data.data.affiliate
                                    );
                                    resolve(r);
                                }
                            },
                            function(err) {
                                reject(err);
                            }
                        );
                    });
                }
            };

            API.Customer = {
                addresses: function(data) {
                    return req(
                        "GET",
                        "/customers/me/addresses",
                        null,
                        data || {},
                        true
                    );
                },
                addressCreate: function(address) {
                    return req("POST", "/customers/me/addresses", address);
                },
                addressDelete: function(addressId) {
                    return req(
                        "DELETE",
                        "/customers/me/addresses/" + addressId
                    );
                },
                addressUpdate: function(addressId, address) {
                    return req(
                        "PUT",
                        "/customers/me/addresses/" + addressId,
                        address
                    );
                },
                carts: function(data) {
                    return req(
                        "GET",
                        "/customers/me/carts",
                        null,
                        data || { dateLimit: 5 },
                        true
                    );
                },
                customer: function(data) {
                    return req("GET", "/customers", null, {
                        email: data
                    });
                },
                getOrder: function(checkoutId) {
                    return req("GET", "/customers/me/orders/" + checkoutId);
                },
                order: function(orderId) {
                    return req("GET", "/customers/orders/" + orderId);
                },
                orderCancel: function(orderId) {
                    return req(
                        "GET",
                        "/customers/orders/" + orderId + "/cancel"
                    );
                },
                orders: function(data) {
                    return req(
                        "GET",
                        "/customers/me/orders",
                        null,
                        data || {},
                        true
                    );
                },
                orderLast: function() {
                    return req("GET", "/customers/me/orders/last");
                },
                update: function(data) {
                    return req("PATCH", "/customers/customers", data);
                }
            };

            API.Email = {
                new_password: function(email) {
                    return req(
                        "POST",
                        "/emails/auth/" + email + "/new_password"
                    );
                },
                contact: function(data) {
                    return req("POST", "/emails/contact", data);
                }
            };

            API.Store = {
                address: function(zipcode) {
                    return $q(function(resolve, reject) {
                        loadingStart();

                        // Busca endereço pelo CEP
                        $http
                            .get(
                                "https://viacep.com.br/ws/" + zipcode + "/json"
                            )
                            .then(
                                function(r) {
                                    loadingStop();

                                    if (r.data.erro) reject();

                                    resolve({
                                        zipcode: zipcode,
                                        address: r.data.logradouro,
                                        district: r.data.bairro,
                                        city: r.data.localidade,
                                        state: r.data.uf
                                    });
                                },
                                function(err) {
                                    loadingStop();

                                    reject();
                                }
                            );
                    });
                },
                banners: function(group) {
                    return req("GET", "/store/banners", null, {
                        group: group
                    });
                },
                coupons: function(code) {
                    return req("GET", "/store/coupons/" + code);
                },
                customizations: function(id) {
                    return req("GET", "/store/items/" + id + "/customizations");
                },
                useCoupon: function(id) {
                    return req("PUT", "/store/coupons/" + id + "/use");
                },
                faq: function(id) {
                    var url = "/store/faq";

                    if (id) url += "/" + id;

                    return req("GET", url);
                },

                /** Configura as parcelas do item
                 * @param  {object} item - Objeto do item a ser configurado
                 * @param  {property} item.options.lenght - Tamanho do array das propriedades de preço
                 * @param  {object} apiInstallments - Recebe configurações de parcelas da loja
                 * @param  {int} price - Recebe preço do item
                 * @param  {int} item.options[0].salesPrice - Preço principal de venda do item
                 * @param  {int} item.options[0].price - Segundo preço de venda do item
                 */
                itemInstallments: function(item, priceOptions) {
                    /**
                     * Caso o objeto do item esteja vazio ou ele não possua propriedades de preço, as propriedades de parcelas são retornadas como vazio.
                     */
                    if (!item || item.options.length == 0) return {};

                    var apiInstallments = api.settings.installments;

                    function _getPrice() {
                        var options =
                            priceOptions ||
                            (item.options[0] ? item.options[0] : item.options);

                        return options.salesPrice || options.price;
                    }

                    price = _getPrice();

                    /**
                     * @param  {int} price - Preço do item
                     * @param  {int} maxInstallments - Número máximo de parcelas do item
                     * @param  {int} min - Calor mínimo das parcelas
                     * @param  {boolean} {varfound=false
                     * @returns Cálculo das parcelas { installmensts: 3, min: 300 }
                     */
                    function calcInstallments(price, maxInstallments, min) {
                        var found = false,
                            r = {
                                times: 1,
                                value: price
                            };

                        while (!found) {
                            var value = price / maxInstallments;

                            if (maxInstallments == 1 || value >= min) {
                                r = {
                                    times: maxInstallments,
                                    value: value
                                };

                                found = true;
                            } else {
                                maxInstallments--;
                            }
                        }

                        return r;
                    }

                    /**
                     * ?????
                     ?                 */
                    if (item.installments)
                        return calcInstallments(
                            price,
                            item.installments.maxInstallments ||
                                apiInstallments.maxInstallments,
                            item.installments.min || apiInstallments.min
                        );
                    else
                        return calcInstallments(
                            price,
                            apiInstallments.maxInstallments,
                            apiInstallments.min
                        );
                },
                items: function(data) {
                    var params = {},
                        url = "/store/items";

                    if (data) {
                        if (typeof data == "string") url += "/" + data;
                        if (typeof data == "object") params = data;
                    }

                    return req("GET", url, null, params);
                },
                sections: function() {
                    return req("GET", "/store/sections");
                },
                settings: function() {
                    return api.settings;
                },
                shipping: function(zipcode) {
                    return req("GET", "/store/shippings", null, {
                        zipcode: zipcode
                    });
                },
                stamp: function(item) {
                    var stamps = api.settings.stamps;

                    if (!stamps) return false;

                    var itemSections = item.tags
                        .map(function(tag) {
                            if (tag.tagsGroup == "Seções") return tag.url;
                        })
                        .filter(function(section) {
                            return typeof section != "undefined";
                        });
                    var stampSections = _.map(stamps.sections, function(
                        stamp,
                        section
                    ) {
                        if (
                            stamp.texts &&
                            stamp.texts.length &&
                            stamp.texts[0].length &&
                            stamp.style
                        )
                            return section;
                    }).filter(function(section) {
                        return typeof section != "undefined";
                    });
                    var possibleSections = _.intersection(
                        itemSections,
                        stampSections
                    );

                    if (possibleSections && possibleSections.length)
                        return stamps.sections[possibleSections[0]];

                    if (
                        stamps.general &&
                        stamps.general.texts.length &&
                        stamps.general.texts[0].length &&
                        stamps.general.style
                    )
                        return stamps.general;

                    return false;
                },
                tags: function(data) {
                    return req("GET", "/store/tags", null, data);
                },
                terms: function(data) {
                    return req("GET", "/store/terms", null, data);
                }
            };

            // Autentica na API
            API.connect = function() {
                localStorage.removeItem("auth");

                return $q(function(resolve, reject) {
                    if (auth) {
                        setAuth(auth);
                        req("GET", "/auth/check").then(
                            function(r) {
                                setUser(r.data.data);
                            },
                            function(err) {
                                setAuth();
                                API.Auth.login(
                                    api.credentials.email,
                                    api.credentials.password
                                );
                            }
                        );
                    } else {
                        API.Auth.login(
                            api.credentials.email,
                            api.credentials.password
                        );
                    }

                    req("GET", "/store/settings").then(
                        function(r) {
                            api.settings = r.data.data;
                            resolve(r);
                        },
                        function(err) {
                            reject(err);
                        }
                    );
                });
            };

            // Informa status de loading à APP
            API.loading = function(start, stop) {
                loadingStart = start;
                loadingStop = stop;
            };

            return API;
        };
    });

// DEPENDENCES
require("./login")(LojaInteligenteModule); // Login Dependences
require("./directives")(LojaInteligenteModule); // Directives
require("./payment")(LojaInteligenteModule); // Payment
require("./shipping")(LojaInteligenteModule); // Shipping
