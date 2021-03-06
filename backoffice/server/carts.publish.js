"use strict";

import moment from "moment";

Meteor.publish("carts", function(customer, status, offset, limit, date, search) {
    //função para retirada dos %
    function regex(value) {
        return { $regex: new RegExp(value, "i") };
    }

    function _getFunnelStatus() {
        return status != "Carrinho Iniciado"
            ? status
            : {
                  $in: ["Carrinho Iniciado", "Checkout Iniciado"]
              };
    }

    var where = {
        funnelStatus: _getFunnelStatus(),
        subnumber: { $exists: false },
        createdAt: {
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
        },
    };

    if(search) {
        where.$or = [
            { "customer.firstname": regex(search) },
            { "customer.lastname": regex(search) },
            { "number": parseInt(search) }
        ]
    }

    if (Roles.userIsInRole(this.userId, "affiliate"))
        where["affiliate.affiliateId"] = this.userId;

    if (customer) {
        where["customer.customerId"] = customer._id;
        delete where['createdAt']
    }

    var options = {
        fields: {
            updatedAt: 1,
            createdAt: 1,
            "cart.total": 1,
            customer: 1,
            number: 1,
            sellers: 1,
            funnelStatus: 1,
            code: 1,
            sellersNames: 1,
            affiliate: 1
        },
        sort: {
            createdAt: -1
        },
        skip: offset,
        limit: limit
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
                where["sellers"] = { $in: [this.userId] };
        }
    }

    Counts.publish(this, "numberOfCarts", Checkouts.find(where), {
        noReady: true
    });

    return Checkouts.find(where, options);
});
