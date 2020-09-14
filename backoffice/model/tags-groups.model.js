TagsGroups = new Mongo.Collection('tagsGroups');

TagsGroups.allow({
  insert: function(userId, tagsGroup) {
    return userId;
  },
  update: function(userId, tagsGroup, fields, modifier) {
    return userId;
  },
  remove: function(userId, tagsGroup) {
    return userId;
  }
});

TagsGroups.attachBehaviour('timestampable');