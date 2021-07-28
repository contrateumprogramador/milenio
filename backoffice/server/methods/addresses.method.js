'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        addressByZip: function(zip) {
            check(zip, String);

            zip = zip.match(/\d/g).join("");

            var address = HTTP.get('https://viacep.com.br/ws/' + zip + '/json').data;

            if (!address || address.erro)
                return { zip: '' };

            return {
                zip: zip,
                address: address.logradouro,
                district: address.bairro,
                city: address.localidade,
                state: address.uf
            };
        },
        AddressesByCustomer: function(customerId){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'salesman', 'expedition','affiliate']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var customer = Customers.findOne({_id: customerId});

            if(!customer)
                throw new Meteor.Error(404, 'Cliente não encontrado.');

            return Addresses.find({'customerId': customer._id}).fetch();
        },
        addressRegister: function(customerId, newAddress) {
            check(customerId, String);
            check(newAddress, Object);

            var addressId;
            var customer = Customers.findOne({ _id: customerId });

            if (!customer)
                throw new Meteor.Error(404, 'Cliente não encontrado.');

            var address = Addresses.findOne({
                customerId: customerId,
                zip: newAddress.zip
            });

            if (address) {
                addressId = address._id;

                Addresses.update({
                    _id: addressId
                }, {
                    $set: newAddress
                });
            } else {
                newAddress.customerId = customerId;

                addressId = Addresses.insert(newAddress);
            }

            return Addresses.findOne(addressId);
        },
        addressRemove: function(address) {
            check(address, Object);

            var address = Addresses.findOne({ _id: address._id });

            if (!address)
                throw new Meteor.Error(404, 'Endereço não encontrado.');

            Addresses.remove({_id: address._id});

            return;
        }
    });
}
