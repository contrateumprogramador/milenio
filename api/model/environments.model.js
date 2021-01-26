Environments = new Mongo.Collection('environments');

Environments.allow({
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

Environments.attachBehaviour('timestampable');

// HOOKS

Environments.after.insert(function (userId, doc){
  var tags = getTagNames(doc.tags);
  var groups = Tags.find({companyId: doc.companyId}).fetch();

  Meteor.defer(function(){
    updateTags(tags, groups);
  });
});

Environments.after.remove(function (userId, doc){
  var tags = getTagNames(doc.tags);
  var groups = Tags.find({companyId: doc.companyId}).fetch();

  Meteor.defer(function(){
    updateTags(tags, groups);
  });
});

Environments.after.update(function(userId, doc){
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
      tag.EnvironmentsCount = Environments.find({'tags.url': tag.url, companyId: group.companyId}).count();
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
