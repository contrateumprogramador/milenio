Customers = new Mongo.Collection('customers');

Customers.allow({
  insert: function(userId, customer) {
    return userId;
  },
  update: function(userId, customer, fields, modifier) {
    return userId;
  },
  remove: function(userId, customer) {
    return userId;
  }
});

Customers.attachBehaviour('timestampable');