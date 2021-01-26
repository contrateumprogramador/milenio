'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        "Environments.add": function(env){
            check(env, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager', 'expedition']))
                throw new Meteor.Error(403, 'Permissão negada.');

            env.companyId = Meteor.user().profile.company.companyId

            env.affiliate = appendAffiliate(env)

            Environments.insert(env);

            return;
        },
        "Environments.list": function(pagination){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager', 'expedition']))
                throw new Meteor.Error(403, 'Permissão negada.');             

            const environments = Environments.find({ 
                'companyId': Meteor.user().profile.company.companyId 
            }, {
                limit: pagination.limit,
                skip: pagination.skip
            }).fetch()

            return {
                environments,
                total: Environments.find({
                    companyId: Meteor.user().profile.company.companyId
                }).count()
            };
        },
        "Environments.search": function(name){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager', 'expedition']))
                throw new Meteor.Error(403, 'Permissão negada.');             

            const environments = Environments.find({ 
                'companyId': Meteor.user().profile.company.companyId,
                name_nd: regex(name)
            }).fetch()

            return environments;
        },
        "Environments.remove": function({ _id }){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager', 'expedition']))
                throw new Meteor.Error(403, 'Permissão negada.');                         

            var env = Environments.findOne({ _id });

            if(!env)
                throw new Meteor.Error(403, 'Ambiente não encontrado.');            

            Environments.remove({ _id: env._id });
        },
        "Environments.edit": function(newEnv){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager', 'expedition']))
                throw new Meteor.Error(403, 'Permissão negada.');  

            var env = Environments.findOne({ _id: newEnv._id });

            if(!env)
                throw new Meteor.Error(403, 'Ambiente não encontrado.');

            newEnv.affiliate = appendAffiliate(newEnv)

            Environments.update({ _id: env._id }, { $set: newEnv }); 

            return;                                              
        }
    });

    function appendAffiliate(env) {
        const affiliate = Meteor.users.findOne({ _id: env.affiliate._id })

        if(!affiliate)
            throw new Meteor.Error(403, 'Decorador não encontrado.');         

        return {
            _id: affiliate._id,
            name: affiliate.profile.firstname + " " + affiliate.profile.lastname
        }
    }

    //função para retirada dos %
    function regex(value) {
        return { $regex: new RegExp(value, "i") };
    }
}
