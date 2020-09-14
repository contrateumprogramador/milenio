'use strict'

Meteor.publish('payment', function(checkoutId) {
    var where = {
        checkoutId: checkoutId
    };

    var options = {
    	limit: 1,
    	sort: {
    		createdAt: -1
    	}
    }

    if (!Roles.userIsInRole(this.userId, 'super-admin')) {
        var user = Meteor.users.findOne({
            _id: this.userId
        }, {
            fields: {
                'profile.company.companyId': 1
            }
        });

        where.companyId = user.profile.company.companyId;
    }

    return Payments.find(where, options);
});
