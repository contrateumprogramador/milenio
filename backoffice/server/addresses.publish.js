'use strict'

Meteor.publish('addresses', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfAddresses', Addresses.find(where), {noReady: true});
  return Addresses.find(where, options);
});
