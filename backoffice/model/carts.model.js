Carts = new Mongo.Collection('carts');

Carts.allow({
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

Carts.attachBehaviour('timestampable');

// After Remove
Carts.after.remove(function(userId, doc) {
    // Update Stats
    Meteor.call('statsCartRemove', doc);
});

// After Update
Carts.after.update(function(userId, doc, fieldNames, modifier, options) {
    // Update Stats
    if (this.previous.funnel.status != 'Ganho' && doc.funnel.status == 'Ganho')
        Meteor.call('statsSaleAdd', doc);
    
    if (this.previous.funnel && this.previous.funnel.status == 'Ganho' && doc.paymentStatus == 'Cancelado')
        Meteor.call('statsSaleCancel', doc);
});
