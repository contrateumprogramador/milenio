Status = new Mongo.Collection('status');

Status.allow({
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

Status.attachBehaviour('timestampable');