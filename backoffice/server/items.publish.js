'use strict'

Meteor.publish('items', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfItems', Items.find(where), {noReady: true});
  return Items.find(where, options);
});
