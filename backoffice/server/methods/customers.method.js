"use strict";

if (Meteor.isServer) {
    Meteor.methods({
        customerAddress: function(customerId, zip) {
            check(customerId, String);
            check(zip, String);

            var address = {};

            zip = zip.match(/\d/g).join("");

            address = Addresses.findOne({
                customerId: customerId,
                zip: zip
            });

            if (!address) address = Meteor.call("addressByZip", zip);

            return address;
        },
        customerRegister: function(newCustomer, edit) {
            check(newCustomer, Object);
            check(edit, Boolean);

            var company = Companies.findOne({
                _id: Meteor.user().profile.company.companyId
            });

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            var customer = Customers.findOne({ email: newCustomer.email });

            if (customer) {
                var query = {
                    $set: {
                        firstname: newCustomer.firstname || customer.firstname,
                        lastname: newCustomer.lastname || customer.lastname,
                        document: newCustomer.document || customer.document,
                        phone: newCustomer.phone
                            ? newCustomer.phone.match(/\d/g).join("")
                            : customer.phone,
                        phone2: newCustomer.phone2
                            ? newCustomer.phone2.match(/\d/g).join("")
                            : customer.phone2
                    }
                };

                if (!edit) {
                    query["$addToSet"] = {
                        companies: company._id
                    };
                }

                if (customer.companies.indexOf(company._id) > -1 && !edit)
                    throw new Meteor.Error(
                        404,
                        "Cliente já cadastrado nessa empresa."
                    );

                Customers.update(
                    {
                        _id: customer._id
                    },
                    query
                );

                query = { _id: customer._id };
            } else {
                newCustomer.companies = [company._id];
                query = {};

                if (Roles.userIsInRole(Meteor.userId(), ["affiliate"]))
                    newCustomer.affiliateId = query.affiliateId = Meteor.userId();

                query["_id"] = Customers.insert(newCustomer);
            }

            return Customers.findOne(query);
        },
        customersList: function(companyId, floor, limit) {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "salesman",
                    "expedition",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            var company = Companies.findOne({
                _id: companyId || Meteor.user().profile.company.companyId
            });

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            const query = { companies: { $in: [company._id] } };

            if (Roles.userIsInRole(Meteor.userId(), ["affiliate"]))
                query.affiliateId = Meteor.userId();

            var customers = Customers.find(query, {
                sort: {
                    createdAt: -1
                },
                skip: floor,
                limit: limit
            }).fetch();

            return {
                customers: customers,
                total: Customers.find({
                    companies: { $in: [company._id] }
                }).count()
            };
        },
        customerRemove: function(id) {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "salesman",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            var customer = Customers.findOne({ _id: id });

            if (!customer)
                throw new Meteor.Error(404, "Cliente não encontrado.");

            Customers.update(
                {
                    _id: customer._id
                },
                {
                    $pull: {
                        companies: Meteor.user().profile.company.companyId
                    }
                },
                {
                    multi: true
                }
            );

            return;
        },
        searchCustomers: function(searchText) {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "salesman",
                    "expedition",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            var company = Companies.findOne({
                _id: Meteor.user().profile.company.companyId
            });

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            var query = { 
                companies: { $in: [company._id] },
                $or: [
                    { firstname: regex(searchText) },
                    { lastname: regex(searchText) },
                    { document: regex(searchText) }
                ]
            };

            console.log(query);

            if (Roles.userIsInRole(Meteor.userId(), ["affiliate"]))
                query.affiliateId = Meteor.userId();

            return Customers.find(query).fetch();
        }
    });

    //função para retirada dos %
    function regex(value) {
        return { $regex: new RegExp(value, "i") };
    }
}
