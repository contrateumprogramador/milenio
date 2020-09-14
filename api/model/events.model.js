Events = new Mongo.Collection('events');

Events.allow({
  insert: function(userId, sale) {
    return userId;
  },
  update: function(userId, sale, fields, modifier) {
    return userId;
  },
  remove: function(userId, sale) {
    return userId;
  }
});

Events.attachBehaviour('timestampable');