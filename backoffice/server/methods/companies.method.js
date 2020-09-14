"use strict";
import _ from "lodash";

if (Meteor.isServer) {
    Meteor.methods({
        companyUser: function() {
            const companyId = _.get(Meteor.user(), "profile.company.companyId");

            if (!companyId)
                throw new Meteor.Error(
                    403,
                    "Você não tem permissão para visualisar esta empresa."
                );

            return Companies.findOne(companyId);
        },
        companiesList: function() {
            if (!Roles.userIsInRole(Meteor.userId(), "super-admin"))
                throw new Meteor.Error(403, "Permissão negada.");

            return Companies.find(
                {},
                {
                    sort: {
                        name: 1
                    }
                }
            ).fetch();
        },
        companyAdd: function(company) {
            check(company, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ["super-admin"]))
                throw new Meteor.Error(
                    403,
                    "Você não tem permissão para adicionar empresas."
                );

            var apiUser = company.apiUser,
                apiPassword = company.password;

            delete company.password;
            delete company.passwordConfirmation;

            var id = Companies.insert(company);

            if (apiUser) {
                var user = {
                    username: apiUser,
                    email: apiUser,
                    password: apiPassword,
                    profile: {
                        firstname: company.name,
                        lastname: "API",
                        company: {
                            companyId: id,
                            name: company.name
                        }
                    },
                    roles: ["api"]
                };

                Meteor.call("userAdd", user);
            }

            var tagsGroup = {
                name: "Categorias",
                companyId: id,
                tags: [],
                categorie: 1
            };

            Tags.insert(tagsGroup);

            return true;
        },
        companyEdit: function(company) {
            check(company, Object);
            check(company._id, String);

            var id = company._id;

            if (!Companies.findOne({ _id: id }))
                throw new Meteor.Error(404, "Empresa não encontrada.");

            Companies.update(
                {
                    _id: id
                },
                {
                    $set: company
                }
            );

            return;
        },
        companyById: function(id) {
            check(id, String);

            var company = Companies.findOne(
                {
                    _id: id
                },
                {
                    fields: {
                        name: 1,
                        companyName: 1,
                        docs: 1,
                        address: 1,
                        emails: 1,
                        phones: 1,
                        gateway: 1
                    }
                }
            );

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            return company;
        },
        companyUsers: function() {
            if (!Roles.userIsInRole(Meteor.userId(), ["admin", "affiliate"]))
                return false;

            var users = Meteor.users
                .find(
                    {
                        "profile.companyId": Meteor.user().profile.companyId
                    },
                    {
                        fields: {
                            "profile.firstname": 1,
                            "profile.lastname": 1
                        },
                        sort: {
                            "profile.firstname": 1
                        }
                    }
                )
                .fetch();

            var r = users.map(function(elem) {
                return {
                    _id: elem._id,
                    name: elem.profile.firstname + " " + elem.profile.lastname
                };
            });

            return r;
        },
        companyValidate: function(id) {
            check(id, String);

            var company = Companies.findOne(
                {
                    _id: id
                },
                {
                    fields: {
                        _id: 1
                    }
                }
            );

            if (!company)
                throw new Meteor.Error(
                    404,
                    "Empresa não cadastrada no sistema de pagamentos, entre em contato com a loja."
                );

            return true;
        },
        upToProduction: function(company) {
            check(company, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ["super-admin"]))
                return false;

            if (company.production)
                return new Meteor.Error(
                    506,
                    "Essa empresa já está em produção."
                );

            Companies.update(
                {
                    _id: company._id
                },
                {
                    $set: {
                        production: 1,
                        ordersCount: 0
                    }
                }
            );

            Meteor.defer(function() {
                Checkouts.remove({ companyId: company._id });
                Coupons.remove({ companyId: company._id });
                Events.remove({ "company.companyId": company._id });
                Payments.remove({ companyId: company._id });
                Meteor.users.remove({
                    "profile.company.companyId": company._id,
                    roles: { $in: ["customer"] }
                });
                Statistics.remove({ companyId: company._id });
            });

            return;
        }
    });
}
