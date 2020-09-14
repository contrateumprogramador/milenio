Orders = new Mongo.Collection('orders');

Orders.allow({
    insert: function(userId, company) {
        return userId;
    },
    update: function(userId, company, fields, modifier) {
        return userId;
    },
    remove: function(userId, company) {
        return userId;
    }
});

Orders.attachBehaviour('timestampable');

// After Insert
Orders.after.insert(function(userId, doc) {
	// Update Stats
	Meteor.call('statsOrderAdd', doc);
});