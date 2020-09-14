Banners = new Mongo.Collection('banners');

Banners.allow({
  insert: function(userId, banners) {
    return userId;
  },
  update: function(userId, banners, fields, modifier) {
    return userId;
  },
  remove: function(userId, banners) {
    return userId;
  }
});

Banners.attachBehaviour('timestampable');