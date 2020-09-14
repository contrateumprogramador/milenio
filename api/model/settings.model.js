Settings = new Mongo.Collection('settings');

Settings.allow({
  insert: function(userId, setting) {
    return userId;
  },
  update: function(userId, setting, fields, modifier) {
    return userId;
  },
  remove: function(userId, setting) {
    return userId;
  }
});

Settings.attachBehaviour('timestampable');
