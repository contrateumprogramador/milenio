'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        planAdd: function(plan){
            check(plan, Object);

            if (!Roles.userIsInRole(Meteor.userId(), 'super-admin'))
                throw new Meteor.Error(403, 'Permissão negada.');

            Plans.insert(plan);

            return;
        },
        plansList: function(){
            if (!Roles.userIsInRole(Meteor.userId(), 'super-admin'))
                throw new Meteor.Error(403, 'Permissão negada.');

            return Plans.find({}).fetch();
        },
        planRemove: function(plan){
            check(plan, Object);

            if (!Roles.userIsInRole(Meteor.userId(), 'super-admin'))
                throw new Meteor.Error(403, 'Permissão negada.');

            Plans.remove({_id: plan._id});

            return;
        },
        planEdit: function(plan){
            check(plan, Object);

            if (!Roles.userIsInRole(Meteor.userId(), 'super-admin'))
                throw new Meteor.Error(403, 'Permissão negada.');

            var oldplan = Plans.findOne({_id: plan._id});

            if(!oldplan)
                throw new Meteor.Error(403, 'plan não encontrada.');

            Plans.update({
                _id: oldplan._id
            },{
                $set: plan
            });

        },
        planById: function(companyId){
            check(companyId, String);

            if (!Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({_id: companyId});

            if(!company)
                throw new Meteor.Error(403, 'Empresa não encontrada.');

            return Plans.findOne({_id: company.planId});
        }

    });
}
