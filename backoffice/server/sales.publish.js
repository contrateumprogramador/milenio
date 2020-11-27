"use strict";

Meteor.publish("sales", function(customer, date, search) {
    //função para retirada dos %
    function regex(value) {
        return { $regex: new RegExp(value, "i") };
    }

    var where = {
        orderNumber: {
            $exists: true
        },
        "payment.time": {
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
        }
    };

    if(search) {
        where.$or = [
            { "customer.firstname": regex(search) },
            { "customer.lastname": regex(search) },
            { "orderNumber": parseInt(search) }
        ]
    }

    if (customer) where["customer.customerId"] = customer._id;

    if (Roles.userIsInRole(this.userId, "affiliate"))
        where["affiliate.affiliateId"] = this.userId;

    var options = {
        fields: {
            updatedAt: 1,
            createdAt: 1,
            "cart.itemsTotal": 1,
            "cart.total": 1,
            customer: 1,
            orderNumber: 1,
            sellers: 1,
            funnelStatus: 1,
            status: 1,
            fractioned: 1,
            code: 1,
            subnumber: 1,
            payment: 1,
            sellersNames: 1,
            affiliate: 1,
            comission: 1
        },
        sort: {
            updatedAt: -1
        }
    };

    if (!Roles.userIsInRole(this.userId, "super-admin")) {
        var user = Meteor.users.findOne(
            {
                _id: this.userId
            },
            {
                fields: {
                    "profile.company.companyId": 1
                }
            }
        );

        if (user) {
            where["companyId"] = user.profile.company.companyId;
            if (Roles.userIsInRole(this.userId, "salesman"))
                where["sellers"] = {
                    $in: [this.userId]
                };
        }
    }

    Counts.publish(this, "numberOfSales", Checkouts.find(where), {
        noReady: true
    });

    return Checkouts.find(where, options);
});
