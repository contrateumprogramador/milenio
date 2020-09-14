Terms = new Mongo.Collection('terms');

Terms.allow({
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

Terms.attachBehaviour('timestampable');