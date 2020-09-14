Statistics = new Mongo.Collection('statistics');

Statistics.allow({
  insert: function(userId, statistic) {
    return userId;
  },
  update: function(userId, statistic, fields, modifier) {
    return userId;
  },
  remove: function(userId, statistic) {
    return userId;
  }
});

Statistics.attachBehaviour('timestampable');