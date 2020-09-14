'use strict'

Meteor.publish('tagsGroups', function(options, searchString) {
    var user = Meteor.users.findOne({
        _id: this.userId
    }, {
        fields: {
            'profile.company.companyId': 1
        }
    });  
  	return TagsGroups.find({'companyId': user.profile.company.companyId});
});
