Shippings = new Mongo.Collection('shippings');

Shippings.allow({
  insert: function(userId, shipping) {
    return userId;
  },
  update: function(userId, shipping, fields, modifier) {
    return userId;
  },
  remove: function(userId, shipping) {
    return userId;
  }
});

Shippings.attachBehaviour('timestampable');