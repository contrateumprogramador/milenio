"use strict";

angular.module("fuseapp").config(function($stateProvider) {
    $stateProvider
        .state("app.store-settings", {
            url: "/loja/configuracoes",
            views: {
                "content@app": {
                    templateUrl:
                        "client/app/store/settings/installments/store.settings.view.ng.html",
                    controller: "AdmSettingsCtrl as vm"
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), ["admin"]);
                        });
                    }
                },
                Configurations: function($q, toast) {
                    return $q(function(resolve, reject) {
                        Meteor.call("getSettings", function(err, r) {
                            if (err) {
                                toast.message(err.reason);
                                reject("NO_DATA");
                            } else {
                                resolve(r);
                            }
                        });
                    });
                }
            },
            bodyClass: "store-settings"
        })
        .state("app.store-descriptions", {
            url: "/loja/descricoes",
            views: {
                "content@app": {
                    templateUrl:
                        "client/app/store/settings/descriptions/store.descriptions.view.ng.html",
                    controller: "AdmDescriptionsCtrl as vm"
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), ["admin"]);
                        });
                    }
                },
                Configurations: function($q, toast) {
                    return $q(function(resolve, reject) {
                        Meteor.call("getSettings", function(err, r) {
                            if (err) {
                                toast.message(err.reason);
                                reject("NO_DATA");
                            } else {
                                resolve(r);
                            }
                        });
                    });
                }
            },
            bodyClass: "store-descriptions"
        })
        .state("app.stamps", {
            url: "/loja/selos",
            views: {
                "content@app": {
                    templateUrl:
                        "client/app/store/settings/stamps/store.stamps.view.ng.html",
                    controller: "AdmStampsCtrl as vm"
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), ["admin"]);
                        });
                    }
                },
                Configurations: function($q, toast) {
                    return $q(function(resolve, reject) {
                        Meteor.call("getSettings", function(err, r) {
                            if (err) {
                                toast.message(err.reason);
                                reject("NO_DATA");
                            } else {
                                resolve(r);
                            }
                        });
                    });
                },
                Sections: function($q, toast) {
                    return $q(function(resolve, reject) {
                        Meteor.call("sectionsList", function(err, r) {
                            if (err) {
                                toast.message(err.reason);
                                reject("NO_DATA");
                            } else {
                                resolve(r);
                            }
                        });
                    });
                }
            },
            bodyClass: "store-stamps"
        })
        .state("app.store-emails", {
            url: "/loja/emails",
            views: {
                "content@app": {
                    templateUrl:
                        "client/app/store/settings/emailTemplate/store.email.view.ng.html",
                    controller: "MailSettingsCtrl as vm"
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), ["admin"]);
                        });
                    }
                },
                Configurations: function($q, toast) {
                    return $q(function(resolve, reject) {
                        Meteor.call("getSettings", function(err, r) {
                            if (err) {
                                toast.message(err.reason);
                                reject("NO_DATA");
                            } else {
                                resolve(r);
                            }
                        });
                    });
                }
            },
            bodyClass: "store-email"
        })
        .state("app.store-billet", {
            url: "/loja/boleto-desconto",
            views: {
                "content@app": {
                    templateUrl:
                        "client/app/store/settings/billetDiscount/store.billet.view.ng.html",
                    controller: "AdmBilletCtrl as vm"
                }
            },
            resolve: {
                user: function($auth) {
                    if (Roles.subscription.ready()) {
                        return $auth.awaitUser(function(user) {
                            return Roles.userIsInRole(Meteor.userId(), ["admin"]);
                        });
                    }
                },
                Configurations: function($q, toast) {
                    return $q(function(resolve, reject) {
                        Meteor.call("getSettings", function(err, r) {
                            if (err) {
                                toast.message(err.reason);
                                reject("NO_DATA");
                            } else {
                                resolve(r);
                            }
                        });
                    });
                }
            },
            bodyClass: "store-billet"
        });
});
