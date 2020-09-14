'use strict'

Meteor.publish('faq', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfFaq', Faq.find(where), {noReady: true});
  return Faq.find(where, options);
});
