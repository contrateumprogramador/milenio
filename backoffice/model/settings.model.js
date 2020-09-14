Settings = new Mongo.Collection('settings');

Settings.allow({
  insert: function(userId, settings) {
    return userId;
  },
  update: function(userId, settings, fields, modifier) {
    return userId;
  },
  remove: function(userId, settings) {
    return userId;
  }
});

Settings.attachBehaviour('timestampable');
