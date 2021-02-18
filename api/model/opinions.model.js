Opinions = new Mongo.Collection('opinions');

Opinions.allow({
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

Opinions.attachBehaviour('timestampable');