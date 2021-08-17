// LojaInteligente API Checkout

import RdStation from "./modules/rdstation";

export const name = "api-checkout";

if (Meteor.isServer) {

    // Auth API configuration
    var Api = new Restivus({
        apiPath: "checkouts",
        defaultHeaders: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept, X-User-Id, X-Auth-Token",
            "Access-Control-Allow-Methods":
                "DELETE, GET, OPTIONS, PATCH, POST, PUT",
            "Content-Type": "application/json"
        },
        enableCors: false,
        prettyJson: true
    });

    // Maps to: /checkouts
    Api.addRoute(
        "",
        {authRequired: false},
        {
            post: {
                // Regras permitidas
                roleRequired: [],
                action: function () {
                    var checkout = this.bodyParams,
                        checkoutId = checkout._id,
                        events = checkout.events;

                    delete checkout._id;

                    if (!checkout.companyId) {
                        if (!this.user) {
                            this.user = Meteor.users.findOne(
                                this.request.headers["x-user-id"]
                            );

                            if (!this.user)
                                return {
                                    statusCode: 401,
                                    body: {
                                        status: "fail",
                                        message: "Não autorizado."
                                    }
                                };
                        }

                        checkout.companyId = this.user.profile.company.companyId;
                    }

                    // Não grava os Events na coleção Checkouts
                    checkout.events = [];

                    function _checkoutCantBeChange(checkoutFind) {
                        if (!checkoutFind.payment) return false;

                        const status = [
                            "Não Pago",
                            "Aguardando Pagamento",
                            "Transação em Andamento",
                            "Falha na Operadora",
                            "Transação em Curso",
                            "Status Indisponível"
                        ];

                        return !status.includes(checkoutFind.payment.status);
                    }

                    // Se checkout tiver _id
                    if (checkoutId) {
                        var checkoutFind = Checkouts.findOne(checkoutId);

                        // Se Checkout não existe
                        if (!checkoutFind) {
                            return {
                                statusCode: 404,
                                body: {
                                    status: "fail",
                                    message: "Checkout não encontrado."
                                }
                            };
                        } else if (_checkoutCantBeChange(checkoutFind)) {
                            return {
                                statusCode: 403,
                                body: {
                                    status: "fail",
                                    message:
                                        "Pedido já realizado, não pode ser alterado."
                                }
                            };
                        }

                        // Atualizar o Checkout
                        Checkouts.update(
                            {_id: checkoutId},
                            {$set: checkout}
                        );
                    } else {
                        // Define número do Checkout
                        checkout.number =
                            (Companies.findOne(checkout.companyId)
                                .checkoutsCount || 0) + 1;

                        // Define um código de acesso
                        checkout.code = parseInt(Math.random(5) * 5000);

                        // Criar um novo Checkout
                        checkoutId = Checkouts.insert(checkout);
                    }

                    // Recupera Checkout
                    checkout = Checkouts.findOne(checkoutId, {
                        fields: {
                            cart: 1,
                            customer: 1,
                            events: 1,
                            shipping: 1,
                            meta: 1,
                            number: 1,
                            code: 1,
                            internal: 1,
                            affiliate: 1
                        }
                    });

                    if (moment(checkout.meta.createdAt).add(3, 'days').isBefore(moment())) {
                        console.log("foi")
                        return {
                            statusCode: 403,
                            body: {
                                status: "fail",
                                message:
                                    "Pedido criado a mais de 3 dias."
                            }
                        };
                    }

                    var user = this.user;

                    // Grava todos os Events
                    Meteor.defer(function () {
                        // Conversão de eventos em Status de Funil
                        var eventsToFunnel = {
                            cart_started: "Carrinho Iniciado",
                            checkout_started: "Checkout Iniciado",
                            shipping_informed: "Endereço Informado",
                            payment_attempt: "Pagamento Iniciado",
                            payment_completed: "Ganho"
                        };

                        var funnelStatus = false;

                        events.forEach(function (event) {
                            // event.checkoutId = checkout._id;
                            // event.company = user.profile.company;

                            // if (user.profile.customerId) {
                            //     event.customer = {
                            //         customerId: user.profile.customerId,
                            //         firstname: user.profile.firstname,
                            //         lastname: user.profile.lastname
                            //     };
                            // } else {
                            //     event.customer = {
                            //         customerId: null,
                            //         firstname: "Desconhecido",
                            //         lastname: ""
                            //     };
                            // }

                            // Se existir Status de Funil pro Event
                            if (eventsToFunnel[event.type])
                                funnelStatus = eventsToFunnel[event.type];

                            // Events.insert(event);
                        });

                        // Se existir Status de Funil
                        // atualizada Checkout
                        if (funnelStatus) {
                            Checkouts.update(
                                {_id: checkoutId},
                                {$set: {funnelStatus}}
                            );
                        }
                    });

                    // Retorna objeto Checkout
                    return {
                        status: "success",
                        data: checkout
                    };
                }
            },
            options: function () {
                return {};
            }
        }
    );

    // Maps to: /checkouts/:checkoutId
    Api.addRoute(
        ":checkoutId",
        {
            authRequired: false
        },
        {
            get: {
                // Regras permitidas
                roleRequired: [],
                action: function () {
                    // Busca Checkout
                    var checkout = Checkouts.findOne(
                        this.urlParams.checkoutId,
                        {
                            fields: {
                                cart: 1,
                                customer: 1,
                                events: 1,
                                shipping: 1,
                                meta: 1,
                                number: 1,
                                code: 1,
                                internal: 1,
                                affiliate: 1
                            }
                        }
                    );

                    // Erro se não encontrar Checkout
                    if (!checkout) {
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message: "Checkout não encontrado."
                            }
                        };
                    }

                    var user = this.user;
                    if (user) {
                        // Grava Event de acesso
                        Meteor.defer(function () {
                            var event = {
                                type: "checkout_accessed",
                                time: new Date(),
                                info: "",
                                checkoutId: checkout._id,
                                company: user.profile.company
                            };

                            if (user.profile.customerId) {
                                event.customer = {
                                    customerId: user.profile.customerId,
                                    firstname: user.profile.firstname,
                                    lastname: user.profile.lastname
                                };
                            } else {
                                event.customer = {
                                    customerId: null,
                                    firstname: "Desconhecido",
                                    lastname: ""
                                };
                            }

                            Events.insert(event);
                        });
                    }

                    // Retorna objeto Checkout
                    return {
                        status: "success",
                        data: checkout
                    };
                }
            },
            options: function () {
                return {};
            }
        }
    );

    // Maps to: /checkouts/:checkoutId/payment
    Api.addRoute(
        ":checkoutId/payment",
        {
            authRequired: false
        },
        {
            post: {
                // Regras permitidas
                roleRequired: [],
                action: function () {
                    var payment = this.bodyParams.payment;

                    // Busca Checkout
                    var checkout = Checkouts.findOne(this.urlParams.checkoutId);

                    var user = this.user ||
                        Meteor.users.findOne({
                            "profile.customerId": checkout.customer.customerId,
                            "profile.company.companyId": checkout.companyId
                        }) || {
                            _id: checkout.customer.customerId,
                            profile: Customers.findOne({
                                _id: checkout.customer.customerId
                            })
                        };

                    if (!user.profile.company)
                        user.profile.company = {
                            companyId: checkout.companyId
                        };

                    // Erro se não encontrar Checkout
                    if (!checkout) {
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message: "Checkout não encontrado."
                            }
                        };
                    }

                    const company = Companies.findOne({
                        _id: user.profile.company.companyId
                    });


                    // Meteor.call("RdStation.sendEvent", {
                    //     event_type: "ORDER_PLACED",
                    //     payload: {
                    //         name: user.profile.firstname + " " + user.profile.lastname,
                    //         email: user.username.split(":mileniomoveis")[0],
                    //         cf_order_id: "order identifier",
                    //         cf_order_total_items: checkout.cart.itemsCount,
                    //         cf_order_status: payment.method.includes("Cartão") ? "payed" :"pending_payment",
                    //         cf_order_payment_method: payment.method.includes("Cartão") ? "Credit Card" : "Invoice",
                    //         cf_order_payment_amount: checkout.cart.total,
                    //     }
                    // }, {})

                    return complete(company, checkout, payment, user);
                }
            },
            options: function () {
                return {};
            }
        }
    );

    // Maps to: /checkouts/get/:number/:code
    Api.addRoute(
        "get/:number/:code",
        {authRequired: false},
        {
            get: {
                // Regras permitidas
                roleRequired: [],
                action: function () {
                    // Busca Checkout
                    var checkout = Checkouts.findOne(
                        {
                            code: parseInt(this.urlParams.code),
                            number: parseInt(this.urlParams.number),
                            createdAt: {$gte: moment().subtract(3, 'days').toDate()}
                        },
                        {
                            fields: {
                                cart: 1,
                                customer: 1,
                                events: 1,
                                shipping: 1,
                                meta: 1,
                                number: 1,
                                code: 1,
                                internal: 1
                            }
                        }
                    );

                    if (!checkout) {
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message: "Checkout não encontrado."
                            }
                        };
                    } else {
                        return {
                            status: "success",
                            data: checkout
                        };
                    }
                }
            },
            options: function () {
                return {};
            }
        }
    );

    // Functions

    // Retorna Items do Cart
    function cartItems(items) {
        var r = [];

        Object.keys(items).forEach(function (key) {
            var item = items[key];

            r.push({
                codigoProduto: item.code || item._id,
                nomeProduto: item.name,
                quantidadeProduto: parseInt(item.quant),
                valorUnitarioProduto:
                    item.options.salesPrice || item.options.price * 100
            });
        });

        return r;
    }

    // Requisição SuperPay API Rest Completa
    function complete(company, checkout, payment, user) {
        // Prepara dados do comprador
        var paymentInfo = paymentData(checkout);

        // paymentInfo.email = "guima@cupideias.com";
        // paymentInfo.telefone = { tipoTelefone: "1" };

        // Número da tentativa de pagamento
        checkout.paymentAttempt = getAttempt(checkout);

        var data = {};

        // se for uma transação de recorrência
        if (checkout.recurrence) {
            // dadosCobranca
            paymentInfo.tipoCliente = 1; // 1 - Pessoa Física / 2 - Pessoa Jurídica
            delete paymentInfo.endereco;

            data.estabelecimento = company.gateway.tokenSuperPay;
            data.recorrencia = {
                formaPagamento: paymentMethod(
                    payment.method,
                    payment.brand,
                    company
                ),
                numeroRecorrencia: parseInt(
                    checkout.number.toString() +
                    checkout.paymentAttempt.toString()
                ),
                valor: company.production
                    ? parseFloat(checkout.cart.total) * 100
                    : parseInt(Math.random() * 200 + 50),
                modalidade: "1",
                periodicidade: checkout.recurrence.periodicity.toString(), // 1 semanal / 2 quinzenal / 3 mensal / 4 bimestral / 5 trimestral / 6 semestral / 7 anual
                urlNotificacao:
                    "https://api.lojainteligente/checkouts/notification/" +
                    company._id,
                processarImediatamente: "true",
                quantidadeCobrancas: "0", //checkout.recurrence.charges.toString(),
                dataPrimeiraCobranca: moment()
                    .format("DD/MM/YYYY")
                    .toString(),
                // dadosEntrega: {
                //     telefone: paymentInfo.telefone
                // },
                dadosCobranca: paymentInfo
            };

            data.recorrencia.dadosCobranca.nomeComprador =
                data.recorrencia.dadosCobranca.nome;
            data.recorrencia.dadosCobranca.emailComprador =
                data.recorrencia.dadosCobranca.email;
            data.recorrencia.dadosCobranca.telefone =
                data.recorrencia.dadosCobranca.telefone[0];
            data.recorrencia.dadosCobranca.telefone.ddi = "55";

            // data.recorrencia.dadosCobranca.tipoCliente = data.recorrencia.dadosCobranca.tipoCliente.toString();

            delete data.recorrencia.dadosCobranca.nome;
            delete data.recorrencia.dadosCobranca.email;
        } else {
            data = {
                codigoEstabelecimento: parseInt(company.gateway.tokenSuperPay),
                codigoFormaPagamento: paymentMethod(
                    payment.method,
                    payment.brand,
                    company
                ),
                transacao: {
                    numeroTransacao:
                        checkout.number.toString() +
                        checkout.paymentAttempt.toString(),
                    valor: company.production
                        ? parseFloat(checkout.cart.total) * 100
                        : parseInt(Math.random() * 200 + 50),
                    valorDesconto: parseFloat(checkout.discount || 0) * 100,
                    parcelas: payment.installments,
                    idioma: 1,
                    urlCampainha:
                        "https://api.lojainteligente/checkouts/notification/" +
                        company._id
                },
                itensDoPedido: cartItems(checkout.cart.items),
                dadosCobranca: paymentInfo,
                dadosEntrega: paymentInfo
            };
        }

        var boletoVencimento;

        if (paymentIs(payment.method, "Boleto")) {
            var settings = Settings.findOne(
                {
                    companyId: checkout.companyId
                },
                {
                    fields: {
                        billet: 1
                    }
                }
            );

            function _calcDescontoBoleto() {
                var discount = settings.billet
                    ? settings.billet.discount
                    : false,
                    total = checkout.cart.itemsTotal;

                if (data.transacao.valorDesconto || !discount) return;

                data.transacao.valorDesconto =
                    (discount.type == "%"
                        ? (total * discount.value) / 100
                        : discount.value) * 100;
                data.transacao.valor -= data.transacao.valorDesconto;
            }

            boletoVencimento = moment().add(
                settings.billet.validity || 5,
                "days"
            );
            data.transacao.dataVencimentoBoleto = boletoVencimento.format(
                "DD/MM/YYYY"
            );

            _calcDescontoBoleto();
        }

        if (paymentIs(payment.method, "Cartão de Crédito")) {
            data.dadosCartao = {
                nomePortador: payment.holder,
                numeroCartao: payment.number,
                codigoSeguranca: payment.cvv,
                dataValidade: expiration(
                    payment.expirationMonth,
                    payment.expirationYear
                )
            };

            if (checkout.recurrence) {
                data.recorrencia.dadosCartao = data.dadosCartao;
                delete data.dadosCartao;
            }
        } else {
            data.transacao.parcelas = 1;
        }

        var newPayment = {
            checkoutNumber: checkout.number,
            paymentAttempt: checkout.paymentAttempt || 0,
            companyId: company._id,
            customerId: checkout.customer.customerId,
            checkoutId: checkout._id,
            ip:
                checkout.meta &&
                checkout.meta.ip &&
                checkout.meta.ip.length <= 15
                    ? checkout.meta.ip
                    : "",
            paymentMethod: payment.method,
            transaction: data
        };

        if (paymentIs(payment.method, "Cartão de Crédito")) {
            newPayment.credit_card = {
                brand: payment.brand,
                number:
                    payment.number.substr(0, 6) +
                    "******" +
                    payment.number.substr(-4, 4),
                expiration_month: payment.expirationMonth,
                expiration_year: payment.expirationYear,
                holder: payment.holder
            };
        }

        if (paymentIs(payment.method, "Boleto"))
            newPayment.maturity = new Date(boletoVencimento.startOf("day"));

        // Cria um novo Payment
        var paymentId = Payments.insert(newPayment),
            payment = Payments.findOne(paymentId);

        // Envia requisão ao SuperPay
        var sp = company.gateway.homologacao
            ? SuperPay.homologacao
            : SuperPay.producao;

        if (company.gateway.superPay) sp.user = company.gateway.superPay;

        // return;
        if (checkout.recurrence)
            sp.url =
                "https://gateway.yapay.com.br/checkout/api/v2/recorrencia/";

        var r = HTTP.post(sp.url, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                usuario: JSON.stringify(sp.user)
            },
            data: data
        });

        payment.transaction = r.data;
        payment.status = paymentStatus(payment.transaction.statusTransacao);

        Meteor.defer(function () {
            // Atualiza Payment
            Payments.update(
                {
                    _id: paymentId
                },
                {
                    $set: {
                        transaction: payment.transaction
                    }
                }
            );

            // Pega os Status utilizados pela Company
            var status = Status.findOne({
                companyId: company._id
            });

            // Encontra o Status 'order' e adiciona o horário nele
            status.status.forEach(function (s, key) {
                if (s.name && s.name == "Pedido Realizado")
                    status.status[key].time = new Date();
            });

            function _getOrderNumber() {
                const lastCheckout = Checkouts.findOne(
                    {
                        companyId: company._id,
                        orderNumber: {
                            $exists: 1
                        }
                    },
                    {
                        fields: {
                            orderNumber: 1
                        },
                        sort: {
                            orderNumber: -1
                        }
                    }
                );

                if (lastCheckout) return parseInt(lastCheckout.orderNumber) + 1;

                return 1;
            }

            const checkoutUpdate = {
                orderNumber: _getOrderNumber(),
                payment: {
                    status: payment.status,
                    method: payment.paymentMethod,
                    time: new Date()
                },
                status: status.status
            };

            if (data.transacao.dataVencimentoBoleto) {
                checkoutUpdate["cart.discount"] =
                    data.transacao.valorDesconto / 100;
                checkoutUpdate["cart.total"] = data.transacao.valor / 100;
            }

            // Atualiza Checkout para ser uma order
            Checkouts.update(
                {
                    _id: checkout._id
                },
                {
                    $set: checkoutUpdate
                }
            );

            // atualiza checkout
            checkout = Checkouts.findOne({
                _id: checkout._id
            });

            // retorna o customer
            var customer = Customers.findOne({
                _id: checkout.customer.customerId
            });

            // se customer ou user não tiver document, atualiza
            if (!customer.document || !user.profile.document)
                updateDocument(customer, user, checkout.customer.document);

            // configura os parâmetros a serem enviados
            body = configureStatus(checkout);

            body.linkSite = company.website;
            body.urlImg =
                company.website + "/assets/images/email-signature.png";

            // configura o email para envio
            customer.email = customer.email.split(":")[0];

            //configura todo o body da requisição
            Meteor.call(
                "configureRequest",
                body,
                customer.email,
                "alteracao-status",
                company.mails.comercial,
                function (err, r) {
                    if (err) {
                        return {
                            statusCode: 404,
                            data: {
                                status: "fail",
                                message: err.message
                            }
                        };
                    }
                }
            );

            // Se foi utilizado um Cupom de Deconto
            // informa uso dele
            if (checkout.cart.coupon) {
                Coupons.update(
                    {
                        _id: checkout.cart.coupon._id
                    },
                    {
                        $inc: {
                            used: 1
                        },
                        $push: {
                            usedBy: {
                                userId: user._id,
                                firstname: user.profile.firstname,
                                lastname: user.profile.lastname,
                                usedAt: new Date()
                            }
                        }
                    }
                );
            }

            if (
                payment.paymentMethod == "Cartão de Crédito" &&
                company.gateway.konduto
            ) {
                kondutoPost(
                    company.gateway.konduto.privateKey,
                    Payments.findOne(paymentId),
                    Checkouts.findOne(checkout._id)
                );
            }
        });

        // Se transação retornar com erro
        if (r.statusCode != 200 && r.statusCode != 201) {
            return {
                statusCode: 403,
                body: {
                    status: "fail",
                    message:
                        "Ocorreu um erro durante o pagamento, tente novamente."
                }
            };
        }

        if ([1, 2, 8].indexOf(payment.transaction.statusTransacao) == -1) {
            return {
                statusCode: 401,
                body: {
                    status: "fail",
                    message:
                        "Pagamento não autorizado, confira os dados e tente novamente."
                }
            };
        }

        //Executa atualização do estoque dos itens pronta entrega
        stockControl(checkout.cart.items)

        return {
            status: "success",
            data: payment
        };
    }

    function stockControl(items) {
        Object.keys(items).forEach(function (key) {
            var item = items[key];

            if (item.stock === 1) {
                Items.update({_id: item._id}, {$inc: {max: -item.quant}})
            }
        });
    }

    function kondutoPost(kondutoKey, payment, cart, customer) {
        var customer = Customers.findOne(payment.customerId);

        var data = {
            id: payment.transaction.numeroTransacao.toString(),
            total_amount: Number(payment.transaction.valor / 100),
            currency: "BRL",
            installments: payment.transaction.parcelas,
            // ip: payment.ip && payment.ip.length <= 15 ? payment.ip : "",
            analyze: true,
            customer: {
                id: cart.customer.customerId,
                name: cart.customer.firstname + " " + cart.customer.lastname,
                phone1: cart.customer.phone,
                email: customer.email,
                tax_id: cart.customer.document
            },
            payment: [
                {
                    type: "credit",
                    bin: payment.credit_card.number.substr(0, 6),
                    last4: payment.credit_card.number.substr(-4),
                    status: kondutoStatus(payment.transaction.statusTransacao),
                    expiration_date:
                        payment.credit_card.expiration_month.toString() +
                        payment.credit_card.expiration_year.toString()
                }
            ],
            billing: {
                name: cart.customer.firstname + " " + cart.customer.lastname,
                address1: cart.shipping.address + ", " + cart.shipping.number,
                address2: cart.shipping.complement,
                city: cart.shipping.city,
                state: cart.shipping.state,
                zip: cart.shipping.zipcode,
                country: "BR"
            },
            shipping: {
                name: cart.customer.firstname + " " + cart.customer.lastname,
                address1: cart.shipping.address + ", " + cart.shipping.number,
                address2: cart.shipping.complement,
                city: cart.shipping.city,
                state: cart.shipping.state,
                zip: cart.shipping.zipcode,
                country: "BR"
            },
            shopping_cart: kondutoShoppingCart(cart.cart.items)
        };

        var r = HTTP.post("https://api.konduto.com/v1/orders", {
            auth: kondutoKey + ":",
            data: data
        });

        var kondutoOrder = kondutoGet(kondutoKey, r.data.order.id);

        Payments.update(
            {
                _id: payment._id
            },
            {
                $set: {
                    konduto: {
                        statusCode: kondutoOrder.statusCode,
                        status: kondutoOrder.data.status,
                        order: kondutoOrder.data.order
                    }
                }
            }
        );

        return;
    }

    function kondutoGet(kondutoKey, id) {
        var r = HTTP.get("https://api.konduto.com/v1/orders/" + id, {
            auth: kondutoKey + ":"
        });

        return r;
    }

    function kondutoStatus(status) {
        switch (status) {
            case 1:
                return "approved";
                break;
            case 3:
                return "declined";
                break;
            default:
                return "pending";
                break;
        }
    }

    function kondutoShoppingCart(items) {
        var r = [];

        items.forEach(function (item) {
            r.push({
                sku: item._id,
                name: item.name,
                unit_cost: parseFloat(
                    item.options.salesPrice || item.options.price
                ),
                quantity: parseInt(item.quant)
            });
        });

        return r;
    }

    // Retorna data de validade do cartão de acordo com padrão SuperPay
    function expiration(month, year) {
        month = month < 10 ? "0" + month.toString() : month;
        return month.toString() + "/" + year.toString();
    }

    // Número da tentativa de pagamento
    function getAttempt(checkout) {
        var count = Payments.find({
            checkoutId: checkout._id
        })
            .count()
            .toString();

        return count < 10 ? "0" + count : count;
    }

    // Confrima método de pagamento
    function paymentIs(method, needed) {
        switch (needed) {
            case "Boleto":
                return method.match("Boleto");
                break;
            case "Cartão de Crédito":
                return method == needed;
                break;
            case "Transferência":
                return ["Transferência Bradesco"].indexOf(method) > 1;
                break;
        }
    }

    // Prepara dados do comprado
    function paymentData(checkout) {
        var customer = checkout.customer,
            shipping = checkout.shipping;

        var data = {
            nome: customer.firstname + " " + customer.lastname,
            email: customer.email,
            documento: customer.document,
            endereco: {
                logradouro: shipping.address,
                numero: shipping.number,
                complemento: shipping.complement || "",
                cep: shipping.zipcode,
                bairro: shipping.district,
                cidade: shipping.city,
                estado: shipping.state,
                pais: "BR"
            },
            telefone: [
                {
                    tipoTelefone: 1,
                    ddi: 55,
                    ddd: checkout.customer.phone.substr(0, 2),
                    telefone: checkout.customer.phone.substr(2)
                }
            ]
        };

        if (!data.email) {
            const customer = Customers.findOne(checkout.customer.customerId, {
                emails: 1
            });
            data.email = customer.email;
        }

        return data;
    }

    // Retorna código do SuperPay referente ao método de pagamento
    function paymentMethod(method, brand, company) {
        // Para Cielo API 3.0
        if (company.gateway.cielo) return 170;

        switch (method) {
            case "Boleto Bradesco":
                return 105;
                break;
            case "Transferência Bradesco":
                return 18;
                break;
            case "Cartão de Crédito":
                switch (brand) {
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
                    case "Visa":
                    default:
                        return 120;
                        break;
                }
                break;
        }
    }

    // Retorna status do pagamento de acordo com códigos do SuperPay
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

    function configureStatus(order, cancel) {
        var dateFormat = "DD/MM/YYYY HH:mm:ss",
            body = {},
            status = {};

        order.status.forEach(function (stat) {
            if (stat.time) status = stat;
        });

        // se não for cancelamento, puxa todos os dados
        body = !cancel
            ? {
                company: order.customer.company.name,
                firstname: order.customer.firstname,
                orderNumber: order.number,
                orderStatus: status.name,
                orderMessage: status.message,
                orderTime: moment(status.time).format(dateFormat)
            }
            : {
                company: order.customer.company.name,
                firstname: order.customer.name,
                orderNumber: order.number
            };

        return body;
    }

    /**
     * updateDocument - Atualiza o CPF de um cliente caso não tenha sido criado
     *
     * @param  {type} customer    customer a ser atualizado
     * @param  {type} user        user a ser atualizado
     * @param  {type} newDocument Novo document (CPF) do cliente
     * @return {type}             description
     */
    function updateDocument(customer, user, newDocument) {
        Customers.update(
            {
                _id: customer._id
            },
            {
                $set: {
                    document: newDocument
                }
            }
        );

        Meteor.users.update(
            {
                _id: user._id
            },
            {
                $set: {
                    "profile.document": newDocument
                }
            }
        );
    }
}

// Configurações SuperPay
SuperPay = {
    producao: {
        url: "https://superpay2.superpay.com.br/checkout/api/v2/transacao/",
        user: {
            login: "cupideias",
            senha: "FbP891bCE55Hl"
        },
        campainha: getCampainha("producao")
    },
    homologacao: {
        url: "https://homologacao.superpay.com.br/checkout/api/v2/transacao/",
        user: {
            login: "superpay",
            senha: "superpay"
        },
        campainha: getCampainha("homologacao")
    }
};

function getCampainha(env) {
    if (Meteor.absoluteUrl().indexOf("homolog") > -1)
        return "https://homolog.lojainteligente.com/checkouts/campainha";

    switch (env) {
        case "producao":
            return "https://api.lojainteligente.com/checkouts/campainha";
            break;
        case "homologacao":
            return "https://homolog.lojainteligente.com/checkouts/campainha";
            break;
    }
}
