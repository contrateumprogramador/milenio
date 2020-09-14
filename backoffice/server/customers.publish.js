'use strict'

Meteor.publish('customers', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfCustomers', Customers.find(where), {noReady: true});
  return Customers.find(where, options);
});
