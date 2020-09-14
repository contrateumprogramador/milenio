"use strict";

if (Meteor.isServer) {
    Meteor.methods({
        getPayment: function(checkoutId) {
            check(checkoutId, String);

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin",
                    "salesman",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            var payment = Payments.findOne(
                { checkoutId: checkoutId },
                {
                    sort: {
                        createdAt: -1
                    }
                }
            );

            return payment;
        },
        paymentCapture: function(id) {
            check(id, String);

            var payment = Payments.findOne(
                { checkoutId: id },
                {
                    sort: {
                        createdAt: -1
                    }
                }
            );

            if (!payment)
                throw new Meteor.Error(404, "Pagamento não encontrado.");

            if (payment.transaction.statusTransacao == 1)
                throw new Meteor.Error(400, "Pagamento já capturado.");

            if (payment.transaction.statusTransacao != 2)
                throw new Meteor.Error(
                    400,
                    "Pagamento não pode ser capturado."
                );

            var company = Companies.findOne(payment.companyId);

            var r = SuperPayPost(
                company,
                "capturar",
                company.gateway.tokenSuperPay,
                payment.transaction.numeroTransacao
            );

            if (r.data.statusTransacao != "1")
                throw new Meteor.Error(400, r.data.transacao.statusTransacao);

            Meteor.defer(function() {
                Meteor.call("paymentStatus", company, payment.checkoutId, 1);
            });

            Payments.update(
                {
                    _id: payment._id
                },
                {
                    $set: {
                        "transaction.statusTransacao": 1,
                        paidAt: new Date(),
                        status: "Pago"
                    }
                }
            );

            Checkouts.update(
                {
                    _id: payment.checkoutId
                },
                {
                    $set: {
                        "payment.status": "Transação Já Paga",
                        "payment.time": new Date()
                    }
                }
            );

            return;
        },
        paymentCancel: function(id) {
            check(id, String);

            var payment = Payments.findOne(
                { checkoutId: id },
                {
                    sort: {
                        createdAt: -1
                    }
                }
            );

            if (!payment)
                throw new Meteor.Error(404, "Pagamento não encontrado.");

            if (payment.transaction.statusTransacao == 13)
                throw new Meteor.Error(400, "Pagamento já cancelado.");

            var company = Companies.findOne(payment.companyId);

            if (!paymentIs(payment.paymentMethod, "Boleto Bradesco")) {
                var r = SuperPayPost(
                    company,
                    "cancelar",
                    company.gateway.tokenSuperPay,
                    payment.transaction.numeroTransacao
                );

                if (r.data.statusTransacao != "13")
                    throw new Meteor.Error(400, "Falha ao cancelar");
            }

            Meteor.defer(function() {
                Meteor.call("paymentStatus", company, payment.checkoutId, 13);
                Meteor.call(
                    "changeStatusMail",
                    Checkouts.findOne(id),
                    false,
                    true
                );
            });

            Payments.update(
                {
                    _id: payment._id
                },
                {
                    $set: {
                        "transaction.statusTransacao": 13,
                        canceledAt: new Date(),
                        status: "Cancelado"
                    }
                }
            );

            Checkouts.update(
                {
                    _id: payment.checkoutId
                },
                {
                    $set: {
                        "payment.status": "Cancelado",
                        "payment.time": new Date()
                    }
                }
            );

            return;
        },
        paymentStatus: function(company, cartId, status) {
            check(company, Object);
            check(cartId, String);
            check(status, Number);

            HTTP.post(
                company.gateway.statusChange,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    encoding: "utf8",
                    data: {
                        _id: cartId,
                        status: status
                    }
                },
                function(error, result) {
                    if (result.content != "ok")
                        throw new Meteor.Error(
                            500,
                            "Erro ao notificar transação"
                        );
                }
            );
        },
        paymentSuperPayUpdate: function(body) {
            check(body, Object);

            var payment = Payments.findOne({
                "transaction.codigoEstabelecimento": body.codigoEstabelecimento.toString(),
                "transaction.numeroTransacao": parseInt(body.numeroTransacao)
            });
            var company = Companies.findOne({
                _id: payment.companyId
            });

            if (!payment)
                throw new Meteor.Error(404, "Pagamento não encontrado.");

            var r = SuperPayGet(
                company,
                body.codigoEstabelecimento,
                body.numeroTransacao
            );

            Payments.update(
                {
                    _id: payment._id
                },
                {
                    $set: {
                        transaction: r.data,
                        status: paymentStatus(r.data.statusTransacao)
                    }
                }
            );

            Meteor.defer(function() {
                Meteor.call(
                    "paymentStatus",
                    company,
                    payment.cartId,
                    payment.transaction.statusTransacao
                );
            });

            return "ok";
        },
        paymentUpdateKonduto: function(id) {
            check(id, String);

            var payment = Payments.findOne(id);

            if (!payment)
                throw new Meteor.Error(404, "Pagamento não encontrado.");

            var company = Companies.findOne(payment.companyId),
                k = {},
                kondutoKey = company.gateway.konduto.privateKey;

            if (!payment.konduto) {
                var cart = Carts.findOne(payment.cartId);

                k = Meteor.call("kondutoPost", kondutoKey, payment, cart);
            } else {
                k = Meteor.call(
                    "kondutoGet",
                    kondutoKey,
                    payment.checkoutNumber.toString() +
                        payment.paymentAttempt.toString()
                );

                if (k.statusCode != 200)
                    throw new Meteor.Error(
                        500,
                        "Erro Konduto: " + k.data.status
                    );
            }

            Payments.update(
                {
                    _id: id
                },
                {
                    $set: {
                        konduto: k.data
                    }
                }
            );

            return;
        }
    });

    function _SuperPaySettings(company) {
        var r = company.gateway.homologacao
            ? SuperPay.homologacao
            : SuperPay.producao;

        if (company.gateway.superPay) r.user = company.gateway.superPay;

        return r;
    }

    function SuperPayGet(company, token, number) {
        var sp = _SuperPaySettings(company);

        return HTTP.get(sp.url + token + "/" + number, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                usuario: JSON.stringify(sp.user)
            },
            data: {}
        });
    }

    function SuperPayPost(company, action, token, number) {
        if (action != "capturar" && action != "cancelar")
            throw new Meteor.Error(400, "Transação incorreta.");

        var sp = _SuperPaySettings(company);

        return HTTP.post(sp.url + token + "/" + number + "/" + action, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                usuario: JSON.stringify(sp.user)
            },
            data: {}
        });
    }

    function paymentIs(method, string) {
        return method == string;
    }

    function paymentStatus(status) {
        switch (status) {
            case 1:
                return "Pago";
                break;
            case 2:
                return "Pago e Não Capturado";
                break;
            case 3:
                return "Não Pago";
                break;
            case 5:
                return "Transação em Andamento";
                break;
            case 8:
                return "Aguardando Pagamento";
                break;
            case 9:
                return "Falha na Operadora";
                break;
            case 13:
                return "Cancelado";
                break;
            case 14:
                return "Estornado";
                break;
            case 21:
                return "Boleto Pago a Menor";
                break;
            case 22:
                return "Boleto Pago a Maior";
                break;
            case 23:
                return "Estrono Parcial";
                break;
            case 24:
                return "Estorno Não Autorizado";
                break;
            case 30:
                return "Transação em Curso";
                break;
            case 31:
                return "Transação Já Paga";
                break;
            case 40:
                return "Aguardando Cancelamento";
                break;
            default:
                return "Status Indisponível";
                break;
        }
    }
}
