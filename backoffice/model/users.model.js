// After Insert
Meteor.users.after.insert(function(userId, doc) {
	if (doc.profile.company) {
		Companies.update({
			_id: doc.profile.company.companyId
		}, {
			$inc: {
				usersCount: 1
			}
		});
	}
});

// After Remove
Meteor.users.after.remove(function(userId, doc) {
	if (doc.profile.company) {
		Companies.update({
			_id: doc.profile.company.companyId
		}, {
			$inc: {
				usersCount: -1
			}
		});
	}
});

// Before Update
