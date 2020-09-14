// LojaInteligente API Events

export const name = 'api-events';

if (Meteor.isServer) {
    // Vars
    var e = [
        'cart_start',
        'checkout_start',
        'customer_identify',
        'item_adde',
        'item_remove',
        'item_quant_change',
        'order_cancel',
        'payment_attempt',
        'payment_deny',
        'payment_complete',
        'payment_capture',
        'shipping_inform',
        'ticket_generate',
        'ticket_access',
        'ticket_pay',
    ];
    
    Meteor.methods({
        events: function(companyId, checkoutId, event, info) {
            // Valida empresa
            Meteor.call('checkCompany', companyId);

            // Valida Checkout
            if (checkoutId && !Checkouts.findOne(checkoutId))
                throw new Meteor.Error(404, 'Checkout não encontrado.');

            // Confere se evento existe
            if (e.indexOf(event) == -1)
                throw new Meteor.Error(404, 'Evento não encontrado.');

            // Grava evento
            var id = Events.insert({
                type: event,
                info: info,
                companyId: companyId,
                checkoutId: checkoutId
            });

            // Executa ação caso exista alguma para o evento
            if (events[event])
                return events[event](checkoutId, info);

            return;
        }
    });

    // API
    var events = {
        // Ao identificar um Customer
        customer_identified: function(checkoutId, customer) {
            // Retorna registro do Customer
            var customer = Meteor.call('customerRegister', customer);

            Checkouts.update({
                _id: checkoutId
            }, {
                $set: {
                    customer: customer
                }
            });

            return customer;
        },
        // Ao informar endereço
        shipping_informed: function(checkoutId, shipping) {
            // Grava endereço de entrega
            Checkouts.update({
                _id: checkoutId
            }, {
                $set: {
                    funnel: Meteor.call('CheckoutFunnel', 2),
                    shipping: shipping
                }
            });

            return;
        }
    };
}
