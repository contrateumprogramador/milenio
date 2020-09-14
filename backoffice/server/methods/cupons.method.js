'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        cupomAdd: function(cupom){
            check(cupom, Object);

            if (!Roles.userIsInRole(Meteor.userId(), 'admin'))
                throw new Meteor.Error(403, 'Permissão negada.');            

            var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

            if (!company)
                throw new Meteor.Error(404, 'Empresa não encontrada.');

            cupom.companyId = company._id;   // grava o id da company

            cupom.used = 0;  // define a quantidade de cupons usados

            Coupons.insert(cupom);
            
            return;            
        },
        cuponsList: function(){
            if (!Roles.userIsInRole(Meteor.userId(), 'admin'))
                throw new Meteor.Error(403, 'Permissão negada.');  

            return Coupons.find({'companyId': Meteor.user().profile.company.companyId}).fetch();
        },
        cupomRemove: function(id){
            check(id, String);

            if (!Roles.userIsInRole(Meteor.userId(), 'admin'))
                throw new Meteor.Error(403, 'Permissão negada.');     

            Coupons.remove({_id: id});

            return;
        },
        cupomEdit: function(cupom){
            check(cupom, Object);

            if (!Roles.userIsInRole(Meteor.userId(), 'admin'))
                throw new Meteor.Error(403, 'Permissão negada.');            

            var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

            if (!company)
                throw new Meteor.Error(404, 'Empresa não encontrada.');

            Coupons.update({
                _id: cupom._id
            },{
                $set: cupom
            });

            return;
        }

    });
}
