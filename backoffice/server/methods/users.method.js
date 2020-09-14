"use strict";

if (Meteor.isServer) {
    Meteor.methods({
        userPasswordRecover: function(email) {
            const user = Meteor.users.findOne(
                {
                    username: email
                },
                {
                    fields: {
                        username: 1,
                        profile: 1
                    }
                }
            );

            if (!user) throw new Meteor.Error(404, "Usuário não encontrado.");

            const password = Date.now().toString();

            Accounts.setPassword(user._id, password);

            Meteor.users.update(user._id, {
                $set: {
                    "profile.passwordChanged": false
                }
            });

            Meteor.call(
                "emailPasswordRecover",
                user.profile.firstname,
                email,
                password
            );

            return;
        },
        listSellers: function() {
            if (!Roles.userIsInRole(Meteor.userId(), ["super-admin", "admin"]))
                throw new Meteor.Error(403, "Permissão negada.");

            var query = {};

            if (!Roles.userIsInRole(Meteor.userId(), "super-admin"))
                query = {
                    "profile.company.companyId": Meteor.user().profile.company
                        .companyId,
                    roles: { $in: ["salesman"] }
                };

            return Meteor.users
                .find(query, {
                    sort: {
                        "profile.firstname": 1
                    }
                })
                .fetch();
        },
        usersList: function() {
            if (!Roles.userIsInRole(Meteor.userId(), ["super-admin", "admin"]))
                throw new Meteor.Error(403, "Permissão negada.");

            var query = {};

            if (!Roles.userIsInRole(Meteor.userId(), "super-admin"))
                query = {
                    "profile.company.companyId": Meteor.user().profile.company
                        .companyId,
                    roles: {
                        $in: ["admin", "salesman", "maintenance", "expedition"]
                    }
                };

            return Meteor.users
                .find(query, {
                    sort: {
                        "profile.firstname": 1
                    }
                })
                .fetch();
        },
        userAdd: function(data) {
            check(data, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ["super-admin", "admin"]))
                throw new Meteor.Error(403, "Permissão negada.");

            if (Meteor.users.findOne({ "emails.address": data.email }))
                throw new Meteor.Error(
                    403,
                    "Usuário com este e-mail já cadastado."
                );

            var company = Companies.findOne({
                _id: data.profile.company.companyId
            });

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            var user = {
                username: data.email,
                email: data.email,
                password: data.password,
                profile: {
                    firstname: data.profile.firstname,
                    lastname: data.profile.lastname,
                    phone: data.profile.phone || null,
                    company: {
                        companyId: data.profile.company.companyId,
                        name: company.name
                    },
                    permissions: data.profile.permissions
                },
                roles: data.roles
            };

            var id = Accounts.createUser(user);

            Roles.addUsersToRoles(id, user.roles);

            return;
        },
        userEdit: function(user) {
            check(user, Object);

            var actualUser = Meteor.users.findOne({ _id: user._id });

            if (!actualUser)
                throw new Meteor.Error(404, "Usuário não encontrado.");

            var company = Companies.findOne({
                _id: user.profile.company.companyId
            });

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            var newUser = {};

            if (user.email != actualUser.emails[0].address) {
                (newUser.username = user.email),
                    (newUser.emails = [
                        {
                            address: user.email,
                            verified: false
                        }
                    ]);
            }

            if (user.password && user.password.length > 0)
                Accounts.setPassword(user._id, user.password);

            newUser.profile = {
                firstname: user.profile.firstname,
                lastname: user.profile.lastname,
                phone: user.profile.phone,
                company: {
                    companyId: user.profile.company.companyId,
                    name: company.name
                },
                permissions: user.profile.permissions
            };

            if (user.roles) newUser.roles = [user.roles];

            Meteor.users.update(
                {
                    _id: user._id
                },
                {
                    $set: newUser
                }
            );

            return;
        },
        userRemove: function(id) {
            check(id, String);

            var user = Meteor.users.findOne(id);

            if (!user) throw new Meteor.Error(404, "Usuário não encontrado.");

            if (
                Roles.userIsInRole(Meteor.userId(), "admin") &&
                user.profile.company.companyId !=
                    Meteor.user().profile.company.companyId
            )
                throw new Meteor.Error(403, "Sem permissão.");

            if (!Roles.userIsInRole(Meteor.userId(), ["super-admin", "admin"]))
                throw new Meteor.Error(403, "Sem permissão.");

            Meteor.users.remove({ _id: id });

            return;
        },
        userPasswordChanged: function(_id) {
            check(_id, String);

            return Meteor.users.update(_id, {
                $set: {
                    "profile.passwordChanged": true
                }
            });
        }
    });
}
