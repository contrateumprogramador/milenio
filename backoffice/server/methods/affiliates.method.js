import { _ } from "lodash";
import { Auth } from "../helpers/Auth";
import { Exists } from "../helpers/Exists";
import { List } from "../helpers/List";

Meteor.methods({
    "Affiliate.findOne": function(query) {
        Auth("admin");

        query = {
            ...query,
            roles: "affiliate",
            "profile.company.companyId": Meteor.user().profile.company.companyId
        };

        const r = Meteor.users.findOne(query, { fields: { profile: 1 } });

        if (!r) throw new Meteor.Error(404, "Decorador não encontrado.");

        return r;
    },
    "Affiliate.list": function(query, options) {
        Auth("admin");

        query = {
            ...query,
            roles: "affiliate",
            "profile.company.companyId": Meteor.user().profile.company.companyId
        };

        options = { ...options, fields: { profile: 1, emails: 1 } };

        const affiliates = List(Meteor.users, query, options),
            affiliatesIds = affiliates.items.map((affiliate) => affiliate._id),
            items = affiliates.items.map((affiliate) => {
                affiliate.comissions = {
                    total: 0,
                    pending: 0,
                    paid: 0
                };

                return affiliate;
            });

        if (affiliatesIds.length) {
            const comissions = Meteor.call(
                "Comission.find",
                { "affiliate.affiliateId": { $in: affiliatesIds } },
                {
                    fields: {
                        comission: 1,
                        status: 1,
                        "affiliate.affiliateId": 1
                    }
                }
            );

            comissions.forEach((comission) => {
                const index = _.findIndex(items, {
                    _id: comission.affiliate.affiliateId
                });

                if (comission.status != "canceled") {
                    items[index].comissions.total += comission.comission;
                    items[index].comissions[comission.status] +=
                        comission.comission;
                }
            });
        }

        affiliates.items = items;

        return affiliates;
    },
    "Affiliate.insert": function(data) {
        check(data, Object);

        Auth("admin");

        if (Meteor.users.findOne({ "emails.address": data.email }))
            throw new Meteor.Error(
                403,
                "Usuário com este e-mail já cadastado."
            );

        var company = Companies.findOne(
            {
                _id: Meteor.user().profile.company.companyId
            },
            {
                fields: { name: 1 }
            }
        );

        if (!company) throw new Meteor.Error(404, "Empresa não encontrada.");

        var user = {
            username: data.email,
            email: data.email,
            password: Date.now().toString(),
            profile: {
                firstname: data.firstname,
                lastname: data.lastname,
                phone: data.phone || null,
                abd: data.abd,
                document: data.document,
                bank: data.bank,
                comissions: {
                    rate: data.comissions.rate,
                    balance: 0,
                    total: 0,
                    pending: 0,
                    paid: 0
                },
                company: {
                    companyId: company._id,
                    name: company.name
                },
                permissions: ["affiliate"]
            },
            roles: ["affiliate"]
        };

        var id = Accounts.createUser(user);

        Roles.addUsersToRoles(id, user.roles);

        Meteor.defer(() => {
            Meteor.call(
                "emailAffiliateWelcome",
                user.profile.firstname,
                user.username,
                user.password
            );
        });

        return;
    },
    "Affiliate.welcome": function(_id) {
        const user = Meteor.users.findOne(_id);

        if (!user) throw new Meteor.Error(404, "Não encontrado");

        const password = Date.now().toString();

        Accounts.setPassword(_id, password);

        Meteor.users.update(user._id, {
            $set: {
                "profile.passwordChanged": false
            }
        });

        Meteor.call(
            "emailAffiliateWelcome",
            user.profile.firstname,
            user.username,
            password
        );
    },
    "Affiliate.remove": function(_id) {
        check(_id, String);
        Auth("admin");
        Exists(Meteor.users, _id);

        Meteor.users.remove(_id);

        return;
    },
    "Affiliate.update": function(data) {
        check(data, Object);

        const _id = data._id;

        Auth("admin");
        Exists(Meteor.users, _id);

        const user = {
            username: data.email,
            emails: [{ address: data.email, verified: false }],
            profile: data
        };

        delete user.profile._id;
        delete user.profile.email;

        const r = Meteor.users.update(_id, {
            $set: user
        });

        updateEnvironments(data, _id)

        return;
    }
});

function updateEnvironments(data, _id) {
    Environments.update(
        { "affiliate._id": _id }, 
        { $set: { "affiliate.name": data.firstname + " " + data.lastname } }, 
        { multi: true }
    )
}