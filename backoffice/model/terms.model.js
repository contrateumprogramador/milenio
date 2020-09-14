Terms = new Mongo.Collection('terms');

Terms.allow({
  insert: function(userId, terms) {
    return userId;
  },
  update: function(userId, terms, fields, modifier) {
    return userId;
  },
  remove: function(userId, terms) {
    return userId;
  }
});

Terms.attachBehaviour('timestampable');