'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        tagsGroupAdd: function(name){
            check(name, String);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

            if (!company)
                throw new Meteor.Error(404, 'Empresa não encontrada.');

            var tagsGroup = {
                'name': name,
                'companyId': company._id,
                'tags': []
            };

            Tags.insert(tagsGroup);

            return;
        },
        tagsGroupEdit: function(id, name){
            check(id, String);
            check(name, String);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var tagsGroup = Tags.findOne({'_id': id});

            if(!tagsGroup)
                throw new Meteor.Error(404, 'Grupo de Tags não encontrado.');

            Tags.update({
                _id: tagsGroup._id
            }, {
                $set: {'name': name}
            });

            return;
        },
        tagsGroupList: function(){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

            if (!company)
                throw new Meteor.Error(404, 'Empresa não encontrada.');

            return Tags.find({companyId: company._id}).fetch();
        },
        tagsGroupRemove: function(group){
            check(group, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var tagsGroup = Tags.findOne({'name': group.name});

            if(!tagsGroup)
                throw new Meteor.Error(404, 'Grupo de Tags não encontrado.');

            Tags.remove(tagsGroup);

            return;
        },
        tagsGroupById: function(id){
            check(id, String);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var tagsGroup = Tags.findOne({_id: id});

            if(!tagsGroup)
                throw new Meteor.Error(404, 'Grupo de Tags não encontrado.');

            return tagsGroup;
        }

    });
}
