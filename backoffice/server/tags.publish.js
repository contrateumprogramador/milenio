'use strict'

Meteor.publish('tags', function(type) {
    var user = Meteor.users.findOne({
        _id: this.userId
    }, {
        fields: {
            'profile.company.companyId': 1
        }
    });

    var where = {
        companyId: (user && user.profile.company) ? user.profile.company.companyId : 'general',
    	tagsGroup: type
    };

    var options = {
    	sort: {
    		name: 1
    	}
    };

    Counts.publish(this, 'numberOfTags', Tags.find(where), { noReady: true });
    return Tags.find(where, options);
});
