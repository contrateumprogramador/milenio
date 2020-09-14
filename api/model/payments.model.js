Payments = new Mongo.Collection('payments');

Payments.allow({
  insert: function(userId, payment) {
    return userId;
  },
  update: function(userId, payment, fields, modifier) {
    return userId;
  },
  remove: function(userId, payment) {
    return userId;
  }
});

Payments.attachBehaviour('timestampable');