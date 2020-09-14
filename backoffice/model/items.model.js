Items = new Mongo.Collection('items');

Items.allow({
  insert: function(userId, item) {
    return userId;
  },
  update: function(userId, item, fields, modifier) {
    return userId;
  },
  remove: function(userId, item) {
    return userId;
  }
});

Items.attachBehaviour('timestampable');

// HOOKS

Items.after.insert(function (userId, doc){
  var tags = getTagNames(doc.tags);
  var groups = Tags.find({companyId: doc.companyId}).fetch();

  Meteor.defer(function(){
    updateTags(tags, groups);
  });
});

Items.after.remove(function (userId, doc){
  var tags = getTagNames(doc.tags);
  var groups = Tags.find({companyId: doc.companyId}).fetch();

  Meteor.defer(function(){
    updateTags(tags, groups);
  });
});

Items.after.update(function(userId, doc){
  var tags = getTagNames(doc.tags, this.previous.tags);
  var groups = Tags.find({companyId: doc.companyId}).fetch();

  Meteor.defer(function(){
    updateTags(tags, groups);
  });
});

// Functions
function getTagNames(newTags, oldTags){
  var newTagsName = [],
      oldTagsName = [];

  newTagsName = newTags.map(function(tag){
    return tag.name;
  });

  if(oldTags){
    oldTagsName = oldTags.map(function(tag){
      return tag.name;
    });
  }

  return newTagsName.concat(oldTagsName);
}

function recountTags(group, tags){
  group.tags.filter(function(tag){
    if(tags.indexOf(tag.name) > -1)
      tag.itemsCount = Items.find({'tags.url': tag.url, companyId: group.companyId}).count();
  });
  return group;
}

function updateTags(tags, groups){
  groups.forEach(function(group){
    group = recountTags(group, tags);

    Tags.update({
      _id: group._id
    }, {
      $set: group
    });
  });
}
