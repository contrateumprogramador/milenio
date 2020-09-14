Payments = new Mongo.Collection('payments');

Payments.allow({
    insert: function(userId, payment) {
        return userId;
    },
    update: function(userId, payment, fields, modifier) {
        return userId;
    },
    remove: function(userId, payment) {
        return userId;
    }
});

Payments.attachBehaviour('timestampable');

// After Update
Payments.after.update(function(userId, doc, fieldNames, modifier, options) {
	// Update Cart PaymentStats
    if (this.previous.status != doc.status && ['Pago','Pago e Não Capturado'].indexOf(doc.status) > -1) {
        Carts.update({
        	_id: doc.cartId
        }, {
        	$set: {
        		paymentStatus: doc.status,
        		funnel: {
        			order: 4,
        			status: 'Ganho'
        		},
        		status: 4
        	}
        });
    }
});
