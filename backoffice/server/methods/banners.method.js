'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        bannerAdd: function(banner, group, isNewGroup){
            check(banner, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

            if (!company)
                throw new Meteor.Error(404, 'Empresa não encontrada');

            if(isNewGroup){
                var newGroup = {
                    "group": group,
                    "companyId": Meteor.user().profile.company.companyId,
                    "banners": [banner]
                };
                Banners.insert(newGroup);
                return;
            } else {
                var oldGroup = Banners.findOne({"group": group, companyId: company._id});
                Banners.update({
                    "_id": oldGroup._id
                }, {
                    $push: {"banners": banner}
                });
                return;
            }
        },
        bannersList: function(){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

            if (!company)
                throw new Meteor.Error(404, 'Empresa não encontrada');

            var banners = Banners.find({ 'companyId': Meteor.user().profile.company.companyId }).fetch();

            return banners;
        },
        bannerRemove: function(banner, group, key){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var bannerGroup = Banners.findOne({ 'group': group, 'companyId': Meteor.user().profile.company.companyId });

            if(!bannerGroup)
                throw new Meteor.Error(403, 'Banner não encontrado.');

            // remove o banner antigo
            bannerGroup.banners.splice(key, 1);

            Banners.update({
                "_id": bannerGroup._id
            }, {
                $set: bannerGroup
            });
        },
        bannerEdit: function(banner, group, ignore, key){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var oldGroup = Banners.findOne({ 'group': group, 'companyId': Meteor.user().profile.company.companyId });

            if(!oldGroup)
                throw new Meteor.Error(403, 'Banner não encontrado.');

            // remove os banners
            oldGroup.banners.splice(key, 1);
            oldGroup.banners.push(banner);

            Banners.update({
                _id: oldGroup._id
            }, {
                $set: oldGroup
            });

            return;
        },
        bannerReorder: function(allGroups, groupName){

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

            if(!company)
                throw new Meteor.Error(403, 'Empresa não encontrada.');

            var newBanners = [];

            allGroups.forEach(function(group){
                if(group.group == groupName)
                    newBanners = group.banners;
            });

            Banners.update({
                'group': groupName,
                'companyId': Meteor.user().profile.company.companyId
            }, {
                $set: {banners: newBanners}
            });
            return;
        },
        groupBannersRemove: function(group){
          check(group, Object);

          if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
              throw new Meteor.Error(403, 'Permissão negada.');

          var company = Companies.findOne({ _id: Meteor.user().profile.company.companyId });

          if(!company)
              throw new Meteor.Error(403, 'Empresa não encontrada.');

          Banners.remove({_id: group._id});

          return;
        }
    });
}
