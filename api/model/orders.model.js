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