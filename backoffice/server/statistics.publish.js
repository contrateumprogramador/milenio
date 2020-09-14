'use strict'

Meteor.publish('statistics', function() {
    var where = {
    	month: moment().format('M'),
    	year: moment().format('YYYY')
    };

    var options = {
    	limit: 1
    };

    if (!Roles.userIsInRole(this.userId, 'super-admin')) {
        var user = Meteor.users.findOne({
            _id: this.userId
        }, {
            fields: {
                'profile.company.companyId': 1
            }
        });

        where.companyId = user.profile.company.companyId;
    } else {
    	where.companyId = 'lojainteligente';
    }

    Counts.publish(this, 'numberOfStatistics', Statistics.find(where), { noReady: true });

    return Statistics.find(where, options);
});
