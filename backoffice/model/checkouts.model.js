Checkouts = new Mongo.Collection('checkouts');

Checkouts.allow({
    insert: function(userId, cart) {
        return userId;
    },
    update: function(userId, cart, fields, modifier) {
        return userId;
    },
    remove: function(userId, cart) {
        return userId;
    }
});

Checkouts.attachBehaviour('timestampable');

Checkouts.after.insert(function(userId, doc){
    // Incrementa contagem de Checkouts da Company
    Companies.update({
        _id: doc.companyId
    }, {
        $inc: {
            checkoutsCount: 1
        }
    });

    if(!doc.subnumber)
    Meteor.call('statsCartAdd', doc);
});

// After Remove
Checkouts.after.remove(function(userId, doc) {
    // Update Stats
    if(doc.orderNumber)
        Meteor.call('statsSaleRemove', doc);
    else
        Meteor.call('statsCartRemove', doc);
});

// After Update
Checkouts.after.update(function(userId, doc, fieldNames, modifier) {
    // Incrementa contagem de Orders da Company
    if (doc.orderNumber && !this.previous.orderNumber) {
        Companies.update({
            _id: doc.companyId
        }, {
            $inc: {
                ordersCount: 1
            }
        });
        Meteor.call('statsSaleAdd', doc);
    }
});
