module.exports = function (ngModule) {
    ngModule.config(function ($stateProvider) {
        $stateProvider.state("home", {
            url: "/",
            templateProvider: [
                "$q",
                function ($q) {
                    var deferred = $q.defer();

                    require.ensure(["../home/home.view.html"], function () {
                        var template = require("../home/home.view.html");
                        deferred.resolve(template);
                    });

                    return deferred.promise;
                }
            ],
            controller: "HomeCtrl as vm",
            resolve: {
                NewItems: function (Loja, toast) {
                    return Loja.Store.items({
                        "tags.url": "home-destaques-1"
                    }).then(
                        function (r) {
                            return r.data.data;
                        },
                        function (err) {
                            toast.message(err.data.message);
                        }
                    );
                },
                Coupon: function ($location, $q, Loja) {
                    return $q(function (resolve, reject) {
                        var coupon = $location.search().cupom;
                        if (coupon) {
                            Loja.Checkout.coupon(coupon).then(
                                function (r) {
                                    console.log(r);
                                    resolve(r.data);
                                },
                                function (err) {
                                    console.log(err);
                                    resolve(err.data);
                                }
                            );
                        } else {
                            resolve(false);
                        }
                    });
                },
                BestSellers: function (Loja, toast) {
                    return Loja.Store.items({
                        "tags.url": "home-destaques-2"
                    }).then(
                        function (r) {
                            return r.data.data;
                        },
                        function (err) {
                            toast.message(err.data.message);
                        }
                    );
                },
                Banners: function (Loja, toast) {
                    return Loja.Store.banners("Home Principal").then(
                        function (r) {
                            return r.data.data[0] ?
                                r.data.data[0].banners :
                                r.data.data.banners;
                        },
                        function (err) {
                            toast.message(err.data.message);
                        }
                    );
                },
                BlocoBanners: function (Loja, toast) {
                    return Loja.Store.banners("Home Bloco").then(
                        function (r) {
                            return r.data.data[0] ?
                                r.data.data[0].banners :
                                r.data.data.banners;
                        },
                        function (err) {
                            toast.message(err.data.message);
                        }
                    );
                },
                HomeSecundario: function (Loja, toast) {
                    return Loja.Store.banners("Home Secundário").then(
                        function (r) {
                            return r.data.data[0]
                                ? r.data.data[0].banners
                                : r.data.data.banners;
                        },
                        function (err) {
                            toast.message(err.data.message);
                        }
                    );
                },
                Affiliate: function (
                    Loja,
                    $location,
                    $rootScope,
                    $document,
                    toast
                ) {
                    const params = $location.search();

                    if (!params.affiliateId && !params.customerId) return false;

                    return Loja.Affiliate.identify(
                        params.affiliateId,
                        params.customerId,
                        params.checkoutId
                    ).then(
                        function (r) {
                            $rootScope.affiliate = r.data.data;
                            console.log($rootScope);
                            return r.data.data;
                        },
                        function (err) {
                            toast.message(err.data.message);
                            return false;
                        }
                    );
                },
                loadHomeCtrl: function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();

                    require.ensure([], function () {
                        var module = require("../home/home.controller.js")(
                            ngModule
                        );
                        $ocLazyLoad.load({name: "mileniomoveis"});
                        deferred.resolve(module);
                    });

                    return deferred.promise;
                }
            }
        });
    });
};
