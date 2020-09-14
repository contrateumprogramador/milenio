'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        faqAdd: function(faq){
            check(faq, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');            

            var companyFaq = Faq.findOne({ 'companyId': Meteor.user().profile.company.companyId });

            var newFaq = {
                'companyId': Meteor.user().profile.company.companyId,
                'question': faq.question,
                'answer': faq.answer,
                'index': Faq.find({}).count(),  
            };
            Faq.insert(newFaq);

            return;
        },
        faqsList: function(){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');             

            var companyFaq = Faq.find({ 
                'companyId': Meteor.user().profile.company.companyId 
            }, {
                sort: {
                    index: 1
                }
            }).fetch();

            return companyFaq;
        },
        faqRemove: function(faq){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');                         

            var companyFaq = Faq.findOne({ _id: faq._id });

            if(!companyFaq)
                throw new Meteor.Error(403, 'Faq não encontrada.');            

            Faq.remove({_id: faq._id});
        },
        faqEdit: function(faq){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');  

            var companyFaq = Faq.findOne({ _id: faq._id });

            // remove o key da faq
            delete faq.key;

            if(!companyFaq)
                throw new Meteor.Error(403, 'Faq não encontrada.');

            Faq.update({
                _id: faq._id
            }, {
                $set: faq
            }); 

            return;                                              
        },
        faqReorder: function(ids){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.'); 

            // percorre os ids anotando a ordenação
            ids.forEach(function(id, i){
                Faq.update({
                    _id: id
                }, {
                    $set: {index: i+1}
                });
            });

            return;
        }
    });
}
