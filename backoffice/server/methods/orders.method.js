'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        orderAccessed: function(id) {
            check(id, String);

            Orders.update({
                _id: id
            }, {
                $push: {
                    accesses: new Date()
                }
            });

            return;
        },
        orderAdd: function(companyId, data) {
            check(companyId, String);
            check(data, Object);

            var order = data.pedido,
                customer = data.comprador,
                products = data.itens;

            var newOrder = {
                companyId: companyId,
                number: order.numero,
                description: order.descricao,
                currency: order.moeda,
                discount: order.desconto,
                total: Number(order.total),
                accesses: [new Date()],
                costumer: {
                    code: customer.id,
                    name: customer.nome,
                    email: customer.email,
                    doc: customer.documento,
                    phone: customer.telefone
                },
                address: {
                    address: customer.endereco,
                    number: customer.numero,
                    complement: customer.complemento,
                    district: customer.bairro,
                    zipCode: customer.cep,
                    city: customer.cidade,
                    state: customer.estado
                },
                products: []
            };

            products.forEach(function(product) {
                newOrder.products.push({
                    code: product.codigo,
                    name: product.nome.trim(),
                    price: Number(product.preco),
                    quant: Number(product.quantidade)
                })
            });

            return Orders.insert(newOrder);
        }
    });
}
