'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        sectionsAdd: function(section){
            check(section, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            // pega o companyId
            section.companyId = Meteor.user().profile.company.companyId;
            section = configure(section);

            // insere
            Sections.insert(section);

            return;
        },
        sectionsList: function(){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            return Sections.find({ 'companyId': Meteor.user().profile.company.companyId }).fetch();
        },
        sectionsRemove: function(section){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var companyId = Meteor.user().profile.company.companyId;

            if(!companyId)
                throw new Meteor.Error(504, 'Empresa não encontrada');

            Sections.remove({_id: section._id, companyId: companyId});

            return;
        },
        sectionsEdit: function(section){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'maintenance']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var companyId = Meteor.user().profile.company.companyId;
            section = configure(section);

            Sections.update({
                companyId: companyId,
                _id: section._id
            }, {
                $set: section
            });

            return;
        }
    });

    function configure(section){
      var newTags = [];
      if(section.subSections){
          section.subSections.forEach(function(tag){
              newTags.push({
                  'name': tag.name,
                  'url': tag.url,
                  'tagsGroup': tag.tagsGroup
              });
          });
      }
      section.subSections = newTags;
      return section;
    }
}
