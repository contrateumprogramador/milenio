if (Meteor.isServer) {
    Meteor.methods({
        kondutoPost: function(kondutoKey, payment, cart) {
            check(kondutoKey, String);
            check(payment, Object);
            check(cart, Object);

            var data = {
                "id": payment.checkoutNumber + payment.paymentAttempt,
                "total_amount": Number(payment.transaction.valor / 100),
                "currency": "BRL",
                "installments": payment.transaction.parcelas,
                "ip": cart.ip,
                "analyze": true,
                "customer": {
                    "id": cart.customer._id,
                    "name": cart.customer.firstname+" "+cart.customer.lastname,
                    "phone1": cart.customer.phone,
                    "email": cart.customer.email,
                    "tax_id": cart.customer.document
                },
                "payment": [{
                    "type": "credit",
                    "bin": payment.credit_card.number.substr(0, 6),
                    "last4": payment.credit_card.number.substr(-4),
                    "status": kondutoStatus(payment.transaction.statusTransacao),
                    "expiration_date": payment.credit_card.expiration_month.toString() + payment.credit_card.expiration_year.toString()
                }],
                "billing": {
                    "name": cart.customer.firstname+" "+cart.customer.lastname,
                    "address1": cart.shipping.address + ', ' + cart.shipping.number,
                    "address2": cart.shipping.complement,
                    "city": cart.shipping.city,
                    "state": cart.shipping.state,
                    "zip": cart.shipping.zipcode,
                    "country": "BR"
                },
                "shipping": {
                    "name": cart.customer.firstname+" "+cart.customer.lastname,
                    "address1": cart.shipping.address + ', ' + cart.shipping.number,
                    "address2": cart.shipping.complement,
                    "city": cart.shipping.city,
                    "state": cart.shipping.state,
                    "zip": cart.shipping.zip,
                    "country": "BR"
                },
                "shopping_cart": shoppingCart(cart.cart.items)
            };

            console.log(kondutoKey);
            console.log(data);

            var r = HTTP.post(
                'https://api.konduto.com/v1/orders', {
                    auth: kondutoKey + ':',
                    data: data
                }
            );

            var kondutoOrder = Meteor.call('kondutoGet', kondutoKey, r.data.order.id);

            Payments.update({
                _id: payment._id
            }, {
                $set: {
                    konduto: {
                        statusCode: kondutoOrder.statusCode,
                        status: kondutoOrder.data.status,
                        order: kondutoOrder.data.order
                    }
                }
            });

            return;
        },
        kondutoGet: function(kondutoKey, id) {
            check(kondutoKey, String);
            check(id, String);

            var r = HTTP.get(
                'https://api.konduto.com/v1/orders/' + id, {
                    auth: kondutoKey + ':'
                }
            );

            return r;
        },
        kondutoPut: function(payment) {
            check(payment, Object);

            var company = Companies.findOne(payment.companyId);

            var r = HTTP.put(
                'https://api.konduto.com/v1/orders/' + payment.konduto.order.id, {
                    auth: company.gateway.konduto.privateKey + ':',
                    data: {
                        status: payment.konduto.order.status,
                        comments: 'Atualizado pela empresa'
                    }
                }
            );

            if (r.statusCode == 200) {
                Payments.update({
                    _id: payment._id
                }, {
                    $set: {
                        'konduto.order.status': r.data.order.new_status
                    }
                });
            }

            return;
        },
        sendKondutoManually: function(paymentId, checkoutId){
            check(paymentId, String);
            check(checkoutId, String);

            var payment = Payments.findOne(paymentId);

            if(!payment)
                throw new Meteor.Error(404, 'Pagamento não encontrado.');

            var checkout = Checkouts.findOne(checkoutId);

            if(!checkout)
                throw new Meteor.Error(404, 'Pedido não encontrado.');

            checkout.customer = Customers.findOne({_id: checkout.customer.customerId});

            if(!checkout.customer)
                throw new Meteor.Error(404, 'Cliente não encontrado.');

            var company = Companies.findOne(checkout.companyId);

            if(!company)
                throw new Meteor.Error(404, 'Empresa não encontrada.');

            return Meteor.call('kondutoPost', company.gateway.konduto.privateKey, payment, checkout);
        }
    });

    function kondutoStatus(status) {
        switch (status) {
            case 1:
                return 'approved';
                break;
            case 3:
                return 'declined';
                break;
            default:
                return 'pending';
                break;
        }
    }

    function shoppingCart(items) {
        var r = [];

        items.forEach(function (item) {
            r.push({
                sku: item._id,
                name: item.name,
                unit_cost: parseFloat(item.options.salesPrice || item.options.price),
                quantity: parseInt(item.quant)
            });
        });

        return r;
    }
}
