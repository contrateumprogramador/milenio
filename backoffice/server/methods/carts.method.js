'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        cartsList: function(completed) {
        	var query = {};

            return Checkouts.find(query).fetch();
        }
    });
}
