"use strict";

if (Meteor.isServer) {
    Meteor.methods({
        editSettings: function(data) {
            check(data, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ["super-admin", "admin"]))
                throw new Meteor.Error(403, "Permissão negada.");

            Settings.update(
                {
                    _id: data._id
                },
                {
                    $set: data
                }
            );

            return;
        },
        getSettings() {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin",
                    "salesman",
                    "maintenance",
                    "expedition",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            return Settings.findOne({
                companyId: Meteor.user().profile.company.companyId
            });
        }
    });
}
