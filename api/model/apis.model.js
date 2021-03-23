Apis = new Mongo.Collection('apis');

Apis.allow({
  insert: function(userId, apis) {
    return userId;
  },
  update: function(userId, apis, fields, modifier) {
    return userId;
  },
  remove: function(userId, apis) {
    return userId;
  }
});

Apis.attachBehaviour('timestampable');