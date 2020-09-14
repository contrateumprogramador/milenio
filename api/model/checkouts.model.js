import { _ } from "lodash";

Checkouts = new Mongo.Collection("checkouts");

Checkouts.allow({
    insert: function(userId, sale) {
        return userId;
    },
    update: function(userId, sale, fields, modifier) {
        return userId;
    },
    remove: function(userId, sale) {
        return userId;
    }
});

Checkouts.attachBehaviour("timestampable");

Checkouts.after.insert(function(userId, doc) {
    // Incrementa contagem de Checkouts da Company
    Companies.update(
        {
            _id: doc.companyId
        },
        {
            $inc: {
                checkoutsCount: 1
            }
        }
    );

    if (!doc.subnumber) Meteor.call("statsCartAdd", doc);
});

Checkouts.after.update(function(userId, doc) {
    // Incrementa contagem de Orders da Company
    if (doc.orderNumber && !this.previous.orderNumber) {
        Companies.update(
            {
                _id: doc.companyId
            },
            {
                $inc: {
                    ordersCount: 1
                }
            }
        );
    }

    if (
        doc.orderNumber &&
        _.get(doc, "payment.status") == "Pago" &&
        _.get(this, "previous.payment.status") != "Pago"
    )
        Meteor.call("statsSaleAdd", doc);
});
