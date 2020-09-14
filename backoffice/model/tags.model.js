Tags = new Mongo.Collection('tags');

Tags.allow({
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

Tags.attachBehaviour('timestampable');
