'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        shippingAdd: function(shipping){
            check(shipping, Object);

            var newShipping = {};

            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var id = Meteor.user().profile.company.companyId;

        	var objLogistics = {
        		'companyId': id,
                'title': shipping.title,
                'zipcodes': {
                    'start': parseInt(shipping.from),
                    'end': parseInt(shipping.to)
                },
                'rate': Shippings.find({companyId: id}).count()+1,
                'price': shipping.price,
                'percent': shipping.percent,
                'minValue': shipping.minValue
        	};
            Shippings.insert(objLogistics);

            return;
        },
        shippingsList: function(){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var companyShipping = Shippings.find({ 'companyId': Meteor.user().profile.company.companyId }).fetch();

            return companyShipping;
        },
        shippingRemove: function(shipping){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var companyFaq = Shippings.findOne({ _id: shipping._id });

            if(!companyFaq)
                throw new Meteor.Error(403, 'Ceps não encontrados.');

            Shippings.remove({ _id: shipping._id});

            return;
        },
        shippingEdit: function(shipping){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');

            var companyFaq = Shippings.findOne({ _id: shipping._id });

            if(!companyFaq)
                throw new Meteor.Error(403, 'Ceps não encontrados.');

            shipping.zipcodes = {
                'start': parseInt(shipping.from),
                'end': parseInt(shipping.to)
            };

            delete shipping.from;
            delete shipping.to;

            Shippings.update({
                _id: shipping._id
            }, {
                $set: shipping
            });

            return;
        },
        changeRate: function(shipping, up){
            if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'manager']))
                throw new Meteor.Error(403, 'Permissão negada.');

            //encontra a faixa de ceps que será alterada
            shipping = Shippings.findOne({ _id: shipping._id });

            if(!shipping)
                throw new Meteor.Error(403, 'Faixa de ceps não encontrada.');

            //efetua a mudança de acordo com parametro up
            shipping.rate = (up) ? shipping.rate+1 : shipping.rate-1;

            //encontra agora a faixa de ceps que mudará também
            var changed = Shippings.findOne({ 'companyId': shipping.companyId, 'rate': shipping.rate });

            //se não encontrar, retorna erro
            if(!changed)
                throw new Meteor.Error(403, 'Não existe uma faixa antes/depois dessa.');

            //muda a faixa de ceps que foi alterada
            changed.rate = (up) ? shipping.rate-1 : shipping.rate+1;

            Shippings.update({
                _id: changed._id
            }, {
                $set: changed
            });

            Shippings.update({
                _id: shipping._id
            }, {
                $set: shipping
            });
        }
    });
}
