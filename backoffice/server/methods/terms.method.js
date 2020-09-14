'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        termsAdd: function(term){
            check(term, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');            

            // pega o companyId
            term.companyId = Meteor.user().profile.company.companyId;

            // insere
            Terms.insert(term);
            
            return;                 
        },
        termsList: function(){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');

            return Terms.find({ 'companyId': Meteor.user().profile.company.companyId }).fetch();
        },
        termsRemove: function(term){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');                         

            var companyId = Meteor.user().profile.company.companyId;

            Terms.remove({_id: term._id, companyId: companyId});

            return;
        },
        termsEdit: function(term){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');  

            var companyId = Meteor.user().profile.company.companyId;

            Terms.update({
                companyId: companyId,
                _id: term._id
            }, {
                $set: term
            });

            return;                                              
        }
    });
}