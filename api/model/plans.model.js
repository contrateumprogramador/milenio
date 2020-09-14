Plans = new Mongo.Collection('plans');

Plans.allow({
  insert: function(userId, plan) {
    return userId;
  },
  update: function(userId, plan, fields, modifier) {
    return userId;
  },
  remove: function(userId, plan) {
    return userId;
  }
});

Plans.attachBehaviour('timestampable');