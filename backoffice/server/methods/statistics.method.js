'use strict';

import {
    _
} from "lodash";

if (Meteor.isServer) {
    let date;

    Meteor.methods({
        statsRecalculate: function (code) {
            if (code != moment().format('YYYY-MM-DD HH:mm'))
                throw new Meteor.Error(403, 'Código incorreto');

            Statistics.remove({});

            Checkouts.find({
                    cart: {
                        $exists: 1
                    }
                }, {
                    fields: {
                        cart: 1,
                        companyId: 1,
                        number: 1,
                        createdAt: 1,
                        payment: 1
                    },
                    sort: {
                        createdAt: -1
                    }
                })
                .fetch()
                .forEach((checkout) => {
                    if (checkout.cart) {
                        console.log('CART ADD', checkout.number, checkout.companyId);
                        Meteor.call('statsCartAdd', checkout);

                        if (['Pago', 'Transação Já Paga'].indexOf(_.get(checkout, 'payment.status')) > -1) {
                            console.log('=====> VENDA');
                            Meteor.call('statsSaleAdd', checkout);
                        }
                    } else {
                        console.error('CHECKOUT', checkout.number, checkout.companyId);
                    }
                });

            console.log('==== TERMINADO ======');
            return 'Falows, valews!';
        },
        statsCartRemove: function (checkout) {
            check(checkout, Object);

            date = checkout.createdAt;

            statsUpdate(checkout.companyId, checkout.cart, function (stats) {
                var inc = {
                    carts: -1
                };

                var day = moment(checkout.createdAt).format('D');

                inc["days." + day + ".carts"] = -1;

                Statistics.update({
                    _id: stats._id
                }, {
                    $inc: inc,
                    $set: {
                        conversion_rate: stats.sales / (stats.carts - 1)
                    }
                });
            });

            return;
        },
        statsCartAdd: function (checkout) {
            check(checkout, Object);

            date = checkout.createdAt;

            statsUpdate(checkout.companyId, checkout.cart, function (stats) {
                var inc = {
                    carts: 1
                };

                var day = moment(checkout.createdAt).format('D');

                inc["days." + day + ".carts"] = 1;

                Statistics.update({
                    _id: stats._id
                }, {
                    $inc: inc,
                    $set: {
                        conversion_rate: stats.sales / (stats.carts - 1)
                    }
                });
            });

            return;
        },
        statsSaleAdd: function (checkout) {
            check(checkout, Object);

            date = checkout.payment.time;

            // se o checkout já tiver sido inserido nas estatísticas, não adiciona novamente
            if (checkout.statistics == true)
                return;
            else
                Checkouts.update({
                    _id: checkout._id
                }, {
                    $set: {
                        statistics: true
                    }
                });

            statsUpdate(checkout.companyId, checkout.cart, function (stats) {
                var revenues = parseFloat(checkout.cart.total);
                var inc = {
                    sales: 1,
                    revenues: revenues
                };

                var day = moment(checkout.payment.time).format("D");

                inc["days." + day + ".sales"] = 1;
                inc["days." + day + ".revenues"] = revenues;

                Statistics.update({
                    _id: stats._id
                }, {
                    $inc: inc,
                    $set: {
                        checkoutId: checkout._id,
                        conversion_rate: stats.carts ?
                            (stats.sales + 1) / stats.carts : 1,
                        average_ticket:
                            (stats.revenues + revenues) / (stats.sales + 1)
                    }
                });
            });

            return;
        },
        statsGet: function (userId, date) {
            if (!Meteor.userId())
                return [];

            var user = Meteor.user();
            var query = {
                companyId: Roles.userIsInRole(user._id, ["super-admin"]) ?
                    "lojainteligente" : user.profile.company.companyId
            };

            switch (date) {
                case "lastMonth":
                    query.month = moment()
                        .subtract(1, "months")
                        .format("M");
                    query.year = moment()
                        .subtract(1, "months")
                        .format("YYYY");

                    break;
                default:
                    query.month = moment().format("M");
                    query.year = moment().format("YYYY");
            }

            query.general = {
                $exists: 0
            };

            return Statistics.findOne(query);
        },
        statsSaleRemove: function (checkout) {
            check(checkout, Object);

            date = checkout.createdAt;

            statsUpdate(checkout.companyId, checkout.cart, function (stats) {
                var revenues = parseFloat(checkout.cart.total);
                var inc = {
                    sales: -1,
                    revenues: -revenues
                };

                var day = moment(checkout.payment.time).format("D");

                inc["days." + day + ".sales"] = -1;
                inc["days." + day + ".revenues"] = -revenues;

                Statistics.update({
                    _id: stats._id
                }, {
                    $inc: inc,
                    $set: {
                        conversion_rate: (stats.sales - 1) / stats.carts,
                        average_ticket:
                            (stats.revenues - revenues) / (stats.sales - 1)
                    }
                });
            });

            return;
        }
    });

    var statsGet = function (query, general) {
        check(query, Object);

        if (general) {
            query.general = 1;
        } else {
            query.year = moment(date).format("YYYY");
            query.month = moment(date).format("M");
        }

        var stats = Statistics.findOne(query);

        if (!stats) {
            query.carts = 0;
            query.sales = 0;
            query.conversion_rate = 0;
            query.revenues = 0;
            query.average_ticket = 0;
            query.days = {};

            var statsId = Statistics.insert(query);
            stats = Statistics.findOne({
                _id: statsId
            });
        }

        return stats;
    };

    var statsUpdate = function (companyId, data, update) {
        check(companyId, String);
        check(update, Function);

        // Company Month
        update(statsGet({
            companyId: companyId
        }));
        // Company General
        update(statsGet({
            companyId: companyId
        }, true));

        // PAGMÓVEIS.com Month
        update(statsGet({
            companyId: "lojainteligente"
        }));
        // PAGMÓVEIS.com General
        update(statsGet({
            companyId: "lojainteligente"
        }, true));
    };
}