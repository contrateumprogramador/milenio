import { Auth } from "../helpers/Auth";

Meteor.methods({
    "Comission.find": function(query, options) {
        return Comissions.find(query, options).fetch();
    },
    "Comission.insert": function(data) {
        check(data, Object);

        Auth("admin");

        const _id = Comissions.insert(data);

        if (_id)
            Checkouts.update(
                { _id: data.checkout.checkoutId },
                {
                    $set: {
                        comission: true
                    }
                }
            );

        return;
    },
    "Comission.remove": function(_id) {
        Auth("admin");

        return Comissions.remove(_id);
    },
    "Comission.stats": function(date, affiliateId) {
        const r = {
            comissionsTotal: 0,
            comissionsPaid: 0,
            comissionsPending: 0,
            sales: 0,
            avarageTicket: 0
        };

        const comissions = _comissionsFind(date, affiliateId);

        comissions.forEach(function(comission) {
            r.sales += comission.checkout.itemsTotal;

            r.comissionsTotal += comission.comission;

            if (comission.status == "pending")
                r.comissionsPending += comission.comission;

            if (comission.status == "paid")
                r.comissionsPaid += comission.comission;
        });

        if (comissions) r.avarageTicket = r.sales / (comissions.length || 1);

        return r;
    },
    "Comission.statement": function(date, affiliateId) {
        return _comissionsFind(date, affiliateId, {
            "checkout.orderNumber": 1,
            customer: 1,
            createdAt: 1
        });
    },
    "Comission.update": function(query, options) {
        Auth("admin");

        return Comissions.update(query, options);
    }
});

function _comissionsFind(date, affiliateId, fields) {
    if (!affiliateId) affiliateId = Meteor.userId();

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

    return Comissions.find(
        {
            "affiliate.affiliateId": affiliateId,
            createdAt: period
        },
        {
            fields: {
                ...fields,
                "checkout.itemsTotal": 1,
                comission: 1,
                status: 1
            }
        }
    ).fetch();
}
