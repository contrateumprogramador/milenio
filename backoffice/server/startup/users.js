Meteor.startup(function() {
    if (Meteor.users.find({ 'emails.address': 'guima@cupideias.com' }).count() === 0) {
        var users = [{
                username: 'guima@cupideias.com',
                email: 'guima@cupideias.com',
                password: 'cup540810',
                profile: {
                    firstname: 'Guima',
                    lastname: 'Ferreira'
                },
                roles: ['super-admin']
            }];

        users.forEach(function(user) {
            var id;

            id = Accounts.createUser(user);

            Roles.addUsersToRoles(id, user.roles);
        });
    }
});