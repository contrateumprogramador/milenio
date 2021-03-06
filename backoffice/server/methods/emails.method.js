// importa o pacote e grava na variável Sparkpost
import { HTTP } from "meteor/http";

// constantes com emails padrões
const authorization = "3dba20609d465f4e5e4ec474728aded289f1fcc0";

if (Meteor.isServer) {
    Meteor.methods({
        emailAffiliateWelcome: function(name, email, password) {
            sendEmail("affiliate-welcome", email, { name, password });
        },
        emailPasswordRecover: function(name, email, password) {
            sendEmail("adm-password-recover", email, { name, password });
        },
        emailAffiliateToCustomer: function(checkout) {
            sendEmail(
                "affiliate-checkout-to-customer",
                checkout.customer.email,
                {
                    name: checkout.customer.firstname,
                    affiliate: `${checkout.affiliate.firstname} ${checkout.affiliate.lastname}`,
                    number: checkout.number,
                    code: checkout.code
                }
            );
        },
        changeStatusMail: function(checkout, status, cancel) {
            // busca dados do checkout no banco
            var order = Checkouts.findOne({ _id: checkout._id });

            if (!order) throw new Meteor.Error(404, "Pedido não encontrado.");

            var company = Companies.findOne({ _id: checkout.companyId });

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            var customer = Customers.findOne({
                _id: order.customer.customerId
            });

            if (!customer)
                customer = Customers.findOne({ _id: order.customer._id });

            if (!customer)
                throw new Meteor.Error(404, "Cliente não encontrado.");

            // configura os parâmetros a serem enviados
            body = configureStatus(order, company, cancel);

            let id;

            if(cancel) id = "order-cancel";
            else if(body.orderStatus === "Pagamento Confirmado") id = "pagamento-confirmado"
            else id = "alteracao-status"

            if(id === "pagamento-confirmado") {
                var payment = Payments.findOne({ checkoutId: checkout._id });
                if (!payment) throw new Meteor.Error(404, "Pagamento não encontrado.");

                body.checkout = maskCheckout(order);
                body.installments = payment.transaction.parcelas;
                body.cardBrand = (payment.paymentMethod === "Cartão de Crédito") ? payment.credit_card.brand : payment.paymentMethod
            }

            // configura o email para envio
            body.linkSite = company.website;
            body.urlImg =
                company.website + "/assets/images/email-signature.png";

            if (customer.email.indexOf(":") > -1)
                customer.email = customer.email.split(":")[0];

            // adiciona o cliente e o email principal da loja para enviar
            var recipients = [customer.email, company.mails.main];

            // envia também para as vendedoras
            if (order.sellers) {
                order.sellers.forEach(function(sellerId) {
                    var mail = Meteor.users.findOne(sellerId, {
                        fields: { username: 1 }
                    }).username;

                    if (mail) recipients.push(mail);
                });
            }            

            recipients.forEach(function(mail) {
                //configura todo o body da requisição
                Meteor.call(
                    "configureRequest",
                    body,
                    mail,
                    id,
                    company.mails.comercial,
                    function(err, r) {
                        if (err) {
                            throw new Meteor.Error(504, "Erro de requisição.");
                        }
                    }
                );
            });
        },
        sendCartMail: function(body, checkout, complete) {
            var company = Companies.findOne({ _id: checkout.companyId });

            // configura o email para envio
            body.linkSite = company.website;
            body.urlImg =
                company.website + "/assets/images/email-signature.png";

            if (checkout.customer.email.indexOf(":") > -1)
                checkout.customer.email = checkout.customer.email.split(":")[0];

            body.firstname = checkout.customer.firstname;
            body.number = checkout.number;
            body.code = checkout.code;

            var id = complete ? "pedido-por-email-milenio" : "pedido-por-email";

            if (complete) {
                checkout.cart.items.forEach(function(item) {
                    var customizations = [];
                    var itemDetails = Items.findOne({ _id: item._id });
                    Object.keys(item.customizations).forEach(function(key) {
                        customizations.push(item.customizations[key]);
                    });
                    item.customizations = customizations;

                    // só adiciona atributos selecionados
                    item.attributes = [];
                    itemDetails.attributes.forEach(function(attribute) {
                        if (body.attributes.indexOf(attribute.title) > -1)
                            item.attributes.push(attribute);
                    });
                });
                body.checkout = checkout;
            }

            //configura todo o body da requisição
            Meteor.defer(function() {
                body.recipients.push(company.mails.main);
                body.recipients.forEach(function(email) {
                    Meteor.call(
                        "configureRequest",
                        body,
                        email,
                        id,
                        company.mails.comercial,
                        function(err, r) {
                            if (err) {
                                throw new Meteor.Error(
                                    504,
                                    "Erro de requisição."
                                );
                            }
                        }
                    );
                });
            });
        },
        // configura o objeto que será enviado na requisição
        configureRequest: function(
            substitution_data,
            to,
            template_id,
            from_mail
        ) {
            // quebra o email de envio em duas partes para o sparkpost
            substitution_data["from_init"] = from_mail.split("@")[0];
            substitution_data["from_end"] = from_mail.split("@")[1];

            // configura o data
            var data = {
                campaign_id: "postman_metadata_example",
                recipients: [
                    {
                        address: to,
                        substitution_data: substitution_data
                    }
                ],
                content: {
                    template_id: template_id
                }
            };

            //configura o header de autenticação
            var headers = { Authorization: authorization };

            Meteor.http.call(
                "POST",
                "https://api.sparkpost.com/api/v1/transmissions",
                { data: data, headers: headers },
                function(res) {
                    console.log(res);
                }
            );
        }
    });

    function sendEmail(template, email, body) {
        var company = Companies.findOne(
            { _id: "T8b7jMLWibW2sjAo6" },
            { fields: { mails: 1, website: 1 } }
        );

        if (!company) throw new Meteor.Error(404, "Empresa não encontrada.");

        body.linkSite = company.website;
        body.urlImg = company.website + "/assets/images/email-signature.png";

        Meteor.call(
            "configureRequest",
            body,
            email,
            template,
            company.mails.comercial,
            function(err, r) {
                if (err) {
                    throw new Meteor.Error(504, "Erro de requisição.");
                }
            }
        );
    }

    // Functions E-mail

    function configureStatus(order, company, cancel) {
        const dateFormat = "DD/MM/YYYY HH:mm:ss";
        let status = {};
        const response = {
            company: company.name,
            firstname: order.customer.firstname,
            orderNumber: order.orderNumber
        };

        order.status.forEach(function(stat) {
            if (stat.time) status = stat;
        });

        if(!cancel) {
            response.orderStatus = status.name
            response.orderMessage = status.message
            response.orderTime = moment(status.time).format(dateFormat)
        }

        if(status.name === "Emissão da NF") {
            response.nfe = order.nfe || "";
        } else if(status.name === "Em Transporte") {
            response.shippingName = order.shipping.companyName || ""
            response.shippingCode = order.shipping.companyCode || ""
        }

        return response;
    }

    function toMoney(value) {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
    }

    function maskCheckout(checkout){
        checkout.updatedAt = moment(checkout.updatedAt).format('DD/MM/YYYY');
        checkout.customer.phone = "("+checkout.customer.phone.substr(0,2)+")"+checkout.customer.phone.substr(2,5)+"-"+checkout.customer.phone.substr(7,11);
        checkout.shipping.zipcode = checkout.shipping.zipcode.substr(0,5)+"-"+checkout.shipping.zipcode.substr(5,8);
        checkout.cart.items.forEach(function(item){
            item.options.price = toMoney((item.options.salesPrice) ? item.options.salesPrice : item.options.price);
            item.total = toMoney(item.total);
            
            var customizations = [];
            Object.keys(item.customizations).forEach(function(key) {
                customizations.push(item.customizations[key]);
            });
            item.customizations = customizations;
        });

        if(checkout.cart.discountType === "%")
            checkout.cart.discount = toMoney((checkout.cart.discount / 100) * checkout.cart.itemsTotal);
        else
            checkout.cart.discount = toMoney(checkout.cart.discount);

        checkout.cart.itemsTotal = toMoney(checkout.cart.itemsTotal);
        checkout.cart.shippingPrice = toMoney(checkout.cart.shippingPrice);
        checkout.cart.total = toMoney(checkout.cart.total);
        return checkout;
    }
}
