Customizations = new Mongo.Collection('customizations');

Customizations.allow({
  insert: function(userId, customization) {
    return userId;
  },
  update: function(userId, customization, fields, modifier) {
    return userId;
  },
  remove: function(userId, customization) {
    return userId;
  }
});

Customizations.attachBehaviour('timestampable');
