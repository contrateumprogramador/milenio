Items = new Mongo.Collection('items');

Items.allow({
  insert: function(userId, item) {
    return userId;
  },
  update: function(userId, item, fields, modifier) {
    return userId;
  },
  remove: function(userId, item) {
    return userId;
  }
});

Items.attachBehaviour('timestampable');