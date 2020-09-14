Sections = new Mongo.Collection('sections');

Sections.allow({
  insert: function(userId, section) {
    return userId;
  },
  update: function(userId, section, fields, modifier) {
    return userId;
  },
  remove: function(userId, section) {
    return userId;
  }
});

Sections.attachBehaviour('timestampable');
