'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        tagAdd: function(form, group){
            check(form, Object);
            check(group, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

            if (!company)
                throw new Meteor.Error(404, 'Empresa não encontrada.');

            var tag = {
                name: form.tag,
                name_nd: form.tag_nd,
                url: form.url,
                icon: "",
                itemsCount: Items.find({'tags.url': form.url, companyId: company._id}).count()
            };

            Tags.update({
                _id: group._id
            }, {
                $push: {tags:tag}
            });

            return;
        },
        tagsRemove: function(tag, tagsGroup){
            check(tag, Object);
            check(tagsGroup, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            Tags.update({
                _id: tagsGroup._id
            }, {
                $pull: {tags: tag}
            });

            return;
        },
        tagsList: function(){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'expedition', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var tagsGroup = Tags.find({'companyId': Meteor.user().profile.company.companyId}).fetch();

            return tagsGroup;
        },
        tagEdit: function(tag, tagsGroup){
            check(tag, Object);

            tag.category = !tag.category;

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            Tags.update({
                _id: tagsGroup._id
            }, {
                $pull: {tags: tag}
            });

            Tags.update({
                _id: tagsGroup._id
            }, {
                $push: {tags: tag}
            });
        },
        tagsReorder: function(tagsGroup){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

            if(!company)
                throw new Meteor.Error(403, 'Empresa não encontrada.');

            Tags.update({
                _id: tagsGroup._id
            }, {
                $set: {tags: tagsGroup.tags}
            });

            return;
        }

    });
}
