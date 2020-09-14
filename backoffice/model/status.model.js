Status = new Mongo.Collection('status');

Status.allow({
  insert: function(userId, status) {
    return userId;
  },
  update: function(userId, status, fields, modifier) {
    return userId;
  },
  remove: function(userId, status) {
    return userId;
  }
});

Status.attachBehaviour('timestampable');