Companies = new Mongo.Collection('companies');

Companies.allow({
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

Companies.attachBehaviour('timestampable');