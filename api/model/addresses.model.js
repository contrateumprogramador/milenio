Addresses = new Mongo.Collection('addresses');

Addresses.allow({
  insert: function(userId, address) {
    return userId;
  },
  update: function(userId, address, fields, modifier) {
    return userId;
  },
  remove: function(userId, address) {
    return userId;
  }
});

Addresses.attachBehaviour('timestampable');