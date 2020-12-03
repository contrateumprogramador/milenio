"use strict";

// importa o pacote e grava na variável Sparkpost
import { HTTP } from "meteor/http";

// constantes com emails padrões
const emailFrom = "master@lojainteligente.com";
const emailLoja = "desenvolvimento@cupideias.com";
const authorization = "1e33a58a9f5d801b97b3b302f6422717e0dd7d6d";

if (Meteor.isServer) {
    Meteor.methods({
        checkoutPay: function(companyId, cart, payment) {
            check(companyId, String);
            check(cart, Object);
            check(payment, Object);

            var cartId = cart._id;
            var company = Companies.findOne({ _id: companyId });
            var newPayment = {};

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            return complete(company, cart, payment);
        },
        checkoutValidate: function(data) {
            check(data, Object);

            var company = Companies.findOne({
                _id: data.key,
                username: data.company
            });

            if (!company) throw new Meteor.Error(403, "Autenticação inválida.");

            return company;
        },
        cartRemove: function(id) {
            check(id, String);

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            var cart = Checkouts.findOne(id);

            if (!cart) throw new Meteor.Error(404, "Carrinho não encontrado.");

            Checkouts.remove({
                _id: id
            });

            return;
        },
        changeCheckoutStatus: function(checkoutId, status) {
            check(checkoutId, String);
            check(status, Object);

            var cart = Checkouts.findOne(checkoutId),
                payment = Payments.findOne(
                    { checkoutId: checkoutId },
                    {
                        sort: {
                            createdAt: -1
                        }
                    }
                );

            if (!cart) throw new Meteor.Error(404, "Pedido não encontrado.");

            // Pega os Status utilizados pela Company
            var arrayStatus = Status.findOne({
                companyId: Meteor.user().profile.company.companyId
            });

            // pega os times antigos para não perder
            var oldTimes = [];
            cart.status.forEach(function(stats) {
                if (stats.time) oldTimes.push(stats.time);
            });

            // Encontra o Status 'order' e adiciona o horário nele
            cart.status = updateStatus(arrayStatus, oldTimes);

            cart.status.forEach(function(itemStatus) {
                if (itemStatus.name == status.name) {
                    itemStatus.time = new Date();
                    status.time = new Date();
                }
            });

            // se tiver capturando o pagamento, faz captura no superPay
            if (
                status.name == "Pagamento Confirmado" &&
                payment.paymentMethod == "Cartão de Crédito"
            )
                Meteor.call("paymentCapture", cart._id);

            Checkouts.update(
                {
                    _id: cart._id
                },
                {
                    $set: {
                        status: cart.status
                    }
                }
            );

            // Verifica se toodos os checkouts de um número chegaram ao fim
            var allCheckoutsNumber = Checkouts.find({
                companyId: cart.companyId,
                orderNumber: cart.orderNumber
            }).fetch();
            checkFractionalCheckouts(allCheckoutsNumber);

            // se status pede email, envia
            if (status.email) {
                Meteor.defer(function() {
                    Meteor.call("changeStatusMail", cart, status, false);
                });
            }
        },
        fractionalDelivery: function(checkout, status) {
            check(checkout, Object);
            check(status, Object);

            var oldCheckout = Checkouts.findOne({ _id: checkout._id });

            // Pega os Status utilizados pela Company
            var arrayStatus = Status.findOne({
                companyId: Meteor.user().profile.company.companyId
            });

            // se for checkout pai, trava checkout na coluna
            if (!oldCheckout.subnumber) {
                oldCheckout.fractioned = true;

                //trava pedido pai
                Checkouts.update(
                    {
                        _id: oldCheckout._id
                    },
                    {
                        $set: oldCheckout
                    }
                );

                // limpa o checkout
                oldCheckout = clearCheckout(oldCheckout);
                oldCheckout = remaningItems(oldCheckout, checkout);

                // gera o número de checkout fracionado
                oldCheckout.subnumber = Checkouts.find({
                    companyId: checkout.companyId,
                    orderNumber: oldCheckout.orderNumber
                }).count();

                // insere o checkout com os itens restantes
                var id = Checkouts.insert(oldCheckout);
            } else {
                oldCheckout = remaningItems(oldCheckout, checkout);
            }

            var quant = Array.isArray(oldCheckout.cart.items)
                ? oldCheckout.cart.items.length
                : Object.keys(oldCheckout.cart.items).length;

            // se for fracionado por inteiro, chama o método de avançar
            if (quant == 0) {
                Meteor.call("changeCheckoutStatus", checkout._id, status);
                return;
            }

            Checkouts.update(
                {
                    _id: oldCheckout._id
                },
                {
                    $set: oldCheckout
                }
            );

            // limpa o checkout
            checkout = clearCheckout(checkout);

            oldTimes = [];
            checkout.status.forEach(function(stats) {
                if (stats.time) oldTimes.push(stats.time);
            });

            // Encontra o Status 'order' e adiciona o horário nele
            checkout.status = updateStatus(arrayStatus, oldTimes);

            checkout.status.forEach(function(itemStatus) {
                if (itemStatus.name == status.name)
                    itemStatus.time = new Date();
            });

            // gera o número de checkout fracionado
            checkout.subnumber = Checkouts.find({
                companyId: checkout.companyId,
                orderNumber: checkout.orderNumber
            }).count();

            // insere o checkout com itens selecionados
            var id = Checkouts.insert(checkout);

            // busca o checkout com o id
            checkout = Checkouts.findOne({ _id: id });

            // se status pede email, envia
            if (status.email) {
                Meteor.defer(function() {
                    Meteor.call("changeStatusMail", checkout, status, false);
                });
            }

            return;
        },
        getCheckoutNumber: function() {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin",
                    "expedition",
                    "salesman",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            return (
                (Companies.findOne(Meteor.user().profile.company.companyId)
                    .checkoutsCount || 0) + 1
            );
        },
        internalManipulateCheckout: function(checkout, edit) {
            check(checkout, Object);

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin",
                    "expedition",
                    "salesman",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            // verifica se existe customer._id ou customer.customerId
            var customerId =
                checkout.customer && checkout.customer._id
                    ? checkout.customer._id
                    : checkout.customer.customerId;

            // se não, insere um novo customer automaticamente
            customerId = Meteor.call(
                "customerRegister",
                checkout.customer,
                true
            )._id;

            // verfiica se shipping._id não existe e se dados foram digitados
            if (
                checkout.shipping &&
                !checkout.shipping._id &&
                Object.keys(checkout.shipping).length > 0
            )
                checkout.shipping = Meteor.call(
                    "addressRegister",
                    customerId,
                    checkout.shipping
                );

            // adiciona/retira informações necessárias do checkout
            checkout.internal = 1;
            checkout.updatedAt = new Date();
            checkout.customer.customerId = customerId;
            delete checkout.customer._id;
            checkout.funnelStatus = Object.keys(checkout.shipping).length
                ? "Endereço Informado"
                : "Checkout Iniciado";

            if (edit) {
                Checkouts.update(
                    {
                        _id: checkout._id
                    },
                    {
                        $set: checkout
                    }
                );
            } else {
                checkout.code = parseInt(Math.random(5) * 5000);

                if (!Roles.userIsInRole(Meteor.userId(), ["super-admin"])) {
                    checkout.companyId = Meteor.user().profile.company.companyId;

                    if (Roles.userIsInRole(Meteor.userId(), ["salesman"]))
                        checkout.sellers = [Meteor.userId()];
                }

                Checkouts.insert(checkout);
            }

            return;
        },
        getCheckout: function(checkoutId) {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin",
                    "expedition",
                    "salesman",
                    "maintenance",
                    "expedition",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            var checkout = Checkouts.findOne({ _id: checkoutId });

            if (!checkout)
                throw new Meteor.Error(404, "Carrinho não encontrado.");

            var customer = Customers.findOne({
                _id: checkout.customer.customerId
            });

            if (customer) {
                checkout.customer._id = checkout.customer.customerId;
                checkout.customer.email = customer.email;
            }

            return checkout;
        },
        sellersEdit: function(checkout) {
            check(checkout, Object);

            if (!Roles.userIsInRole(Meteor.userId(), ["super-admin", "admin"]))
                throw new Meteor.Error(403, "Sem permissão.");

            var cart = Checkouts.findOne(checkout._id);

            if (!cart) throw new Meteor.Error(404, "Carrinho não encontrado.");

            cart.sellers = checkout.sellers.map(function(seller) {
                return seller._id;
            });

            cart.sellersNames = checkout.sellers.map(function(seller) {
                return seller.name;
            });

            var unset = {};

            if (cart.sellers.length == 0) unset["$unset"] = { sellers: "" };

            Checkouts.update(
                {
                    _id: checkout._id
                },
                {
                    $set: cart
                }
            );

            if (unset) {
                Checkouts.update(
                    {
                        _id: checkout._id
                    },
                    unset
                );
            }

            return;
        },
        updateCheckoutPayment: function(checkoutId) {
            check(checkoutId, String);

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin",
                    "expedition",
                    "salesman",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            var checkout = Checkouts.findOne(checkoutId);

            if (!checkout)
                throw new Meteor.Error(404, "Carrinho não encontrado.");

            var payment = Payments.findOne(
                { checkoutId: checkoutId },
                {
                    sort: {
                        createdAt: -1
                    }
                }
            );

            if (payment) {
                var set = {
                    "payment.method": payment.paymentMethod
                };

                // verifica se status do checkout não bate com o de pagamento
                // se não, atualiza os dados
                if (
                    checkout.payment.status !=
                    paymentStatus(payment.transaction.statusTransacao)
                ) {
                    set["payment.status"] = paymentStatus(
                        payment.transaction.statusTransacao
                    );
                    set["payment.time"] = payment.updatedAt;
                }

                Checkouts.update(
                    {
                        _id: checkout._id
                    },
                    {
                        $set: set
                    }
                );
            }

            return;
        },
        "Checkout.updateCheckout": function(checkout) {
            check(checkout, Object);

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "super-admin",
                    "admin",
                    "expedition",
                    "salesman",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            Checkouts.update({ _id: checkout._id }, { $set: checkout });

            return;
        }
    });

    function expiration(month, year) {
        month = month < 10 ? "0" + month.toString() : month;
        return month.toString() + year.toString();
    }

    function cartItems(items) {
        var r = [];

        items.forEach(function(item) {
            r.push({
                codigoProduto: item.id,
                nomeProduto: item.name,
                quantidadeProduto: parseInt(item.quant),
                valorUnitarioProduto: item.price * 100
            });
        });

        return r;
    }

    function paymentData(cart) {
        var data = {
            nome: cart.customer.name,
            email: cart.customer.email,
            documento: cart.customer.document,
            endereco: {
                logradouro: cart.shipping.address,
                numero: cart.shipping.number,
                complemento: cart.shipping.complement || "",
                cep: cart.shipping.zip,
                bairro: cart.shipping.district,
                cidade: cart.shipping.city,
                estado: cart.shipping.state,
                pais: "BR"
            },
            telefone: [
                {
                    tipoTelefone: 1,
                    ddi: 55,
                    ddd: cart.customer.phone.substr(0, 2),
                    telefone: cart.customer.phone.substr(2)
                }
            ]
        };

        return data;
    }

    function complete(company, cart, payment) {
        check(company, Object);

        var paymentInfo = paymentData(cart);

        cart.attempt = getAttempt(cart);

        var data = {
            codigoEstabelecimento: parseInt(company.gateway.tokenSuperPay),
            codigoFormaPagamento: paymentMethod(payment.brand),
            transacao: {
                numeroTransacao: cart.number + cart.attempt,
                valor: parseFloat(cart.total) * 100,
                valorDesconto: parseFloat(cart.discount || 0) * 100,
                parcelas: payment.installments,
                idioma: 1
            },
            dadosCartao: {
                nomePortador: payment.holder,
                numeroCartao: payment.number,
                codigoSeguranca: payment.cvv,
                dataValidade:
                    payment.expirationMonth + "/" + payment.expirationYear
            },
            itensDoPedido: cartItems(cart.items),
            dadosCobranca: paymentInfo,
            dadosEntrega: paymentInfo
        };

        var SuperPayUser = company.gateway.superPay
            ? company.gateway.superPay
            : SuperPay.user;

        var r = HTTP.post(SuperPay.url, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                usuario: JSON.stringify(SuperPayUser)
            },
            data: data
        });

        if (r.statusCode != 200 && r.statusCode != 201)
            throw new Meteor.Error(
                r.statusCode,
                "Ocorreu um erro durante o pagamento."
            );

        var newPayment = {
            cart_number: cart.number,
            attempt: cart.attempt,
            companyId: company._id,
            customerId: cart.customer.customerId,
            cartId: cart._id,
            credit_card: {
                brand: payment.brand,
                number:
                    payment.number.substr(0, 6) +
                    "******" +
                    payment.number.substr(-4, 4),
                expiration_month: payment.expirationMonth,
                expiration_year: payment.expirationYear,
                holder: payment.holder
            },
            transaction: r.data
        };

        return Meteor.call("paymentAdd", company, newPayment, cart);
    }

    function brand(brand) {
        switch (brand) {
            case "Visa":
                return "visa";
                break;
            case "MasterCard":
                return "mastercard";
                break;
            case "Elo":
                return "elo";
                break;
            case "Diners Club":
                return "diners";
                break;
            case "Discover":
                return "discover";
                break;
            case "American Express":
                return "amex";
                break;
        }
    }

    function getAttempt(cart) {
        // var l = 'abcdefghijklmnopqrstuvwxyz';

        var count = Payments.find({
            cart_number: cart.number
        })
            .count()
            .toString();

        return count < 10 ? "0" + count : count;
    }

    function paymentMethod(brand) {
        switch (brand) {
            case "Visa":
                return 120;
                break;
            case "MasterCard":
                return 121;
                break;
            case "American Express":
                return 122;
                break;
            case "Elo":
                return 123;
                break;
            case "Diners Club":
                return 124;
                break;
            case "Discover":
                return 125;
                break;
            case "Maestro":
                return 128;
                break;
            case "Visa Electron":
                return 129;
                break;
        }
    }

    function checkFractionalCheckouts(checkouts) {
        if (checkouts.length == 1) return;
        //verifica se pelo menos um dos checkouts foi fracionado
        else {
            var i = 0,
                count = 0;
            for (var i = 0; i < checkouts.length; i++)
                if (checkouts[i].fractioned) count++;

            // se não encontrar nenhum, retorna
            if (!count) return;
        }

        var count = 0,
            mainCheckout = {};

        //percorre os checkouts contando quantos estão no último status
        checkouts.forEach(function(checkout) {
            if (checkout.status[checkout.status.length - 1].time) count++;
            else mainCheckout = checkout;
        });

        // se todos os outros checkouts estão no último status, manda o principal para lá também
        if (count == checkouts.length - 1) {
            mainCheckout = setLastStatus(mainCheckout);
            Checkouts.update(
                { _id: mainCheckout._id },
                {
                    $set: {
                        status: mainCheckout.status
                    }
                }
            );
        }
    }

    function clearCheckout(checkout) {
        delete checkout._id;
        delete checkout.fractioned;
        checkout.createdAt = new Date();
        checkout.createdBy = Meteor.userId();
        checkout.updatedAt = new Date();
        checkout.updatedBy = Meteor.userId();
        return checkout;
    }

    /**
     * remaningItems - Retorna os itens remanescentes de um checkout
     *
     * @param  {Object} oldCheckout Checkout antigo/salvo no banco
     * @param  {Object} checkout    Novo checkout fracionado
     * @return {Object}             Retorna checkout com os itens restantes
     */
    function remaningItems(oldCheckout, checkout) {
        var oldCart = oldCheckout.cart.items,
            cart = checkout.cart.items,
            cartStringfied = cart.map(function(stringfied) {
                return generateStringfied(stringfied);
            });

        for (var i = 0; i < oldCart.length; i++) {
            var stringfied = generateStringfied(oldCart[i]);

            if (cartStringfied.indexOf(stringfied) > -1) {
                oldCart[i].quant -=
                    cart[cartStringfied.indexOf(stringfied)].quant;
                if (oldCart[i].quant == 0) {
                    oldCart.splice(i, 1);
                    i--; //como tira um item do array, diminui o contador
                }
            }
        }

        return oldCheckout;
    }

    /**
     * generateStringfied - Gera string única para identificar item
     *
     * @param  {Object} item Item para se gerar a string
     * @return {String}      String gerada por item único
     */
    function generateStringfied(item) {
        var stringfied = item._id;
        stringfied += item.options.sku ? item.options.sku : item.options[0].sku;
        if (item.customizations) {
            Object.keys(item.customizations).forEach(function(key) {
                stringfied += item.customizations[key].option.code;
            });
        }
        return stringfied;
    }

    /**
     * setLastStatus - Seta o último status disponível
     *
     * @param  {Object} checkout Checkout antigo
     * @return {Object}          Checkout com status alterado
     */
    function setLastStatus(checkout) {
        checkout.status.forEach(function(itemStatus) {
            itemStatus.time = new Date();
        });
        return checkout;
    }

    function updateStatus(status, dates) {
        var newStatus = [];
        status.status.forEach(function(stats, key) {
            newStatus.push({
                name: stats.name,
                message: stats.message,
                mandatory: stats.mandatory,
                email: stats.email,
                internal: stats.internal,
                time: dates[key] || false
            });
        });
        return newStatus;
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
