Sales = new Mongo.Collection('sales');

Sales.allow({
  insert: function(userId, sale) {
    return userId;
  },
  update: function(userId, sale, fields, modifier) {
    return userId;
  },
  remove: function(userId, sale) {
    return userId;
  }
});

Sales.attachBehaviour('timestampable');

// After Insert
Sales.after.insert(function(userId, doc) {
	// Update Stats
	Meteor.call('statsSaleAdd', doc);
});