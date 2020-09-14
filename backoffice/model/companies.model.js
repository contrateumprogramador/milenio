Companies = new Mongo.Collection('companies');

Companies.allow({
    insert: function(userId, company) {
        return userId;
    },
    update: function(userId, company, fields, modifier) {
        return userId;
    },
    remove: function(userId, company) {
        return userId;
    }
});

Companies.attachBehaviour('timestampable');

Companies.after.insert(function(userId, doc) {

    Settings.insert({
      "companyId": doc._id,
      "installments": {
        "min": 0,
        "maxInstallments": 1
      },
      "descriptions": [{
          "name": "Descrição",
          "value": "description"
      }]
    });

    Status.insert({
    	status: [{
			"name" : "Pedido Realizado",
			"message" : "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato.",
			"mandatory": true,
      "internal": false,
      "email": true
		},
		{
			"name" : "Pagamento Confirmado",
			"message" : "Seu pagamento foi confirmado, em breve seu pedido estará em produção.",
			"mandatory": true,
      "internal": false,
      "email": true
		}],
		"companyId": doc._id
    });

    Shippings.insert({
        "title": "Faixa-base",
        "rate": 1,
        "companyId": doc._id,
        "zipcodes": {
            "start": 00000000,
            "end": 99999999
        },
        "base": true
    });
});
