import { Auth } from "../helpers/Auth";
import { _ } from "lodash";

Meteor.methods({
    "Stats.admin": function(date) {
        const r = {
            carts: 0,
            sales: 0,
            conversionRate: 0,
            revenues: 0,
            averageTicket: 0
        };

        const period = {
            $gte: new Date(
                moment(date)
                    .startOf("month")
                    .format()
            ),
            $lte: new Date(
                moment(date)
                    .endOf("month")
                    .format()
            )
        };

        const query = {
            $or: [{ createdAt: period }, { "status.1.time": period }],
            companyId: _.get(Meteor.user(), "profile.company.companyId")
        };

        if (Roles.userIsInRole(Meteor.userId(), "salesman"))
            query.sellers = Meteor.userId();

        const checkouts = Checkouts.find(query, {
            fields: {
                "cart.total": 1,
                status: 1
            }
        }).fetch();

        r.carts = checkouts.length;

        checkouts.forEach(function(checkout) {
            const orderConfirmed = _.find(checkout.status, {
                name: "Pagamento Confirmado"
            });

            if (_.get(orderConfirmed, "time")) {
                r.sales++;
                r.revenues += checkout.cart.total;
            }
        });

        if (checkouts.length) {
            r.avarageTicket = r.revenues / r.sales;
            r.conversionRate = r.sales / r.carts;
        }

        return r;
    },
    "Stats.affiliate": function(date, affiliateId) {
        if (!affiliateId) affiliateId = Meteor.userId();

        const r = {
            comissionsTotal: 0,
            comissionsPaid: 0,
            comissionsPending: 0,
            sales: 0,
            avarageTicket: 0
        };

        const period = {
            $gte: new Date(
                moment(date)
                    .startOf("month")
                    .format()
            ),
            $lte: new Date(
                moment(date)
                    .endOf("month")
                    .format()
            )
        };

        const checkouts = Checkouts.find(
            {
                "affiliate.affiliateId": affiliateId,
                "status.1.time": period
            },
            {
                fields: {
                    "cart.total": 1,
                    "cart.shippingPrice": 1
                }
            }
        ).fetch();

        checkouts.forEach(function(checkout) {
            r.sales += checkout.cart.total - (checkout.cart.shippingPrice || 0);
        });

        if (checkouts) r.avarageTicket = r.sales / checkouts.length;

        Comissions.find({
            "affiliate.affiliateId": affiliateId,
            createdAt: period
        }).forEach(function(comission) {
            r.comissionsTotal += comission.comission;

            if (comission.status == "pending")
                r.comissionsPending += comission.comission;

            if (comission.status == "paid")
                r.comissionsPending += comission.comission;
        });

        return r;
    }
});
