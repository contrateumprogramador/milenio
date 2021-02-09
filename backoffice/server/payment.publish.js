'use strict'

Meteor.publish('payments', function(checkouts) {
    checkouts = checkouts.map((checkout) => checkout._id)

    var where = {
        checkoutId: { $in: checkouts }
    };

    var options = {
    	sort: {
    		createdAt: -1
    	}
    }

    return Payments.find(where, options);
});
