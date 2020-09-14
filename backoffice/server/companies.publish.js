'use strict'

Meteor.publish('companies', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfCompanies', Companies.find(where), {noReady: true});
  return Companies.find(where, options);
});
