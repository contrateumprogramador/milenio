// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See api-email-tests.js for an example of importing.
export const name = 'api-email';

// importa o pacote e grava na variável Sparkpost
import { HTTP } from 'meteor/http';

// constantes com emails padrões
const emailFrom = 'master@lojainteligente.com';
const emailLoja = 'desenvolvimento@cupideias.com';
const authorization = "3dba20609d465f4e5e4ec474728aded289f1fcc0";

if (Meteor.isServer) {

    // Auth API configuration
    var Api = new Restivus({
        apiPath: 'emails/',
        defaultHeaders: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, X-User-Id, X-Auth-Token',
            'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS, PATCH, POST, PUT',
            'Content-Type': 'application/json'
        },
        enableCors: false,
        prettyJson: true
    });

    // Contact
    // =============================================================================

    // Maps to: /emails/contact
    Api.addRoute('contact', { authRequired: false }, {
        post: {
            action: function() {
                //loga o usuário corretamente
                setUser(this);

                var body = this.bodyParams;

                // busca a empresa
                var company = Companies.findOne({_id: this.user.profile.company.companyId});

                //configura os dados que serão convertidos nos parâmetros do template
                body.empresa = company.name;
                body = configureContact(body);

                body.linkSite = company.website;
                body.urlImg = company.website+"/assets/images/email-signature.png";

                //configura todo o body da requisição
                Meteor.call('configureRequest', body, company.mails.contact, "contato", company.mails.contact, function(err, r){
                    if(err){
                        return {
                            statusCode: 404,
                            data: { status: 'fail', message: err.message }
                        };                          
                    }
                });  

                return {
                    status: 'success',
                    data: 'Mensagem enviada com sucesso.'
                };                      		
            }      		
        }, // end POST
        options: function() {
            return {};
        }
    });

    // Auth
    // =============================================================================    

    // Maps to: /auth/:userId/welcome
    Api.addRoute('auth/:userId/welcome', { authRequired: false }, {
        post: {
            action: function() {
                //loga o usuário corretamente
                setUser(this);

                var body = this.bodyParams;

            	// busca dados do user no banco
            	var user = Meteor.users.findOne({_id: this.urlParams.userId});

            	if(!user){
	                return {
	                    statusCode: 404,
	                    data: { status: 'fail', message: 'Usuário não encontrado.' }
	                };       		
            	}

                var company = Companies.findOne({_id: user.profile.company.companyId});

                if(!company){
                    return {
                        statusCode: 404,
                        data: { status: 'fail', message: 'Empresa não encontrada.' }
                    };
                }

                // gera uma nova senha
                var newPass = (Date.now() * parseInt(Math.random() * 10 + 1)).toString().substr(0, 8); // Gera um 'password' pro User

                // modifica a senha do usuário
                Accounts.setPassword(user._id, newPass);

                // adiciona a nova senha no corpo do email
                body.password = newPass;
                body.firstname = user.profile.firstname;
                body.company = user.profile.company.name;
                body.linkSite = company.website;
                body.urlImg = company.website+"/assets/images/email-signature.png";

                if(user.username.indexOf(':') > -1)
                    user.username = user.username.split(':')[0];

                //configura todo o body da requisição
				Meteor.call('configureRequest', body, user.username, "welcome", company.mails.main, function(err, r){
                    if(err){
                        return {
                            statusCode: 404,
                            data: { status: 'fail', message: err.message }
                        };                          
                    }
                });  

                return {
                    status: 'success',
                    data: 'Mensagem enviada com sucesso.'
                };                      
            }      		
        }, // end POST
        options: function() {
            return {secureProtocol: 'SSLv3_method'};
        }
    });   

    // Maps to: /auth/:userId/new_password
    Api.addRoute('auth/:userId/new_password', { authRequired: false }, {
        post: {
            action: function() {
                //loga o usuário corretamente
                setUser(this);

                var body = this.bodyParams;

            	// busca dados do user no banco
            	var user = Meteor.users.findOne({username: this.urlParams.userId+":"+this.user.profile.company.username});

            	if(!user){
	                return {
	                    statusCode: 404,
	                    data: { status: 'fail', message: 'Usuário não encontrado.' }
	                };       		
            	}

                if(user.username.indexOf(':') > -1)
                    user.username = user.username.split(':')[0];

                var company = Companies.findOne({_id: user.profile.company.companyId});

                if(!company){
                    return {
                        statusCode: 404,
                        data: { status: 'fail', message: 'Empresa não encontrada.' }
                    };
                }

            	// gera uma nova senha
            	var newPass = (Date.now() * parseInt(Math.random() * 10 + 1)).toString().substr(0, 8); // Gera um 'password' pro User

            	// modifica a senha do usuário
            	Accounts.setPassword(user._id, newPass);

            	// adiciona a nova senha no corpo do email
            	body.password = newPass;
                body.company = company.name;
                body.firstname = user.profile.firstname;
                body.linkSite = company.website;
                body.urlImg = company.website+"/assets/images/email-signature.png";

                //configura todo o body da requisição
                Meteor.call('configureRequest', body, user.username, "new-password", company.mails.main, function(err, r){
                    if(err){
                        return {
                            statusCode: 404,
                            data: { status: 'fail', message: err.message }
                        };                          
                    }
                });     

                return {
                    status: 'success',
                    data: 'Mensagem enviada com sucesso.'
                };                  
            }      		
        }, // end POST
        options: function() {
            return {};
        }
    });  

    // Orders
    // =============================================================================    

    // Maps to: /orders/:checkoutId/status
    Api.addRoute('orders/:checkoutId/status', { authRequired: false }, {
        post: {
            action: function() {
                //loga o usuário corretamente
                setUser(this);
                
                var body = this.bodyParams;

                // busca dados do user no banco
                var order = Checkouts.findOne({_id: this.urlParams.checkoutId});

                if(!order){
                    return {
                        statusCode: 404,
                        data: { status: 'fail', message: 'Pedido não encontrado.' }
                    };              
                }

                var company = Companies.findOne({_id: order.companyId});

                // retorna o customer
                var customer = Customers.findOne({_id: order.customer.customerId});

                // configura os parâmetros a serem enviados
                body = configureStatus(order);

                body.linkSite = company.website;
                body.urlImg = company.website+"/assets/images/email-signature.png";                

                // configura o email para envio
                customer.email = customer.email.split(":")[0];

                //configura todo o body da requisição
                Meteor.call('configureRequest', body, customer.email, "alteracao-status", company.mails.comercial, function(err, r){
                    if(err){
                        return {
                            statusCode: 404,
                            data: { status: 'fail', message: err.message }
                        };                          
                    }
                });  

                return {
                    status: 'success',
                    data: 'Mensagem enviada com sucesso.'
                };                      
            }           
        }, // end POST
        options: function() {
            return {secureProtocol: 'SSLv3_method'};
        }
    });   

    // Maps to: /orders/:orderId/cancel
    Api.addRoute('orders/:checkoutId/cancel', { authRequired: false }, {
        post: {
            action: function() {
                //loga o usuário corretamente
                setUser(this);

                var body = this.bodyParams;

                // busca dados do user no banco
                var order = Checkouts.findOne({_id: this.urlParams.checkoutId});

                if(!order){
                    return {
                        statusCode: 404,
                        data: { status: 'fail', message: 'Pedido não encontrado.' }
                    };              
                }

                // retorna o customer
                var customer = Customers.findOne({_id: order.customer.customerId});

                var company = Companies.findOne({_id: order.companyId});

                // configura os parâmetros a serem enviados
                body = configureStatus(order, true);

                // configura o email para envio
                if(customer.email.indexOf(':') > -1)
                    customer.email = customer.email.split(":")[0];

                body.linkSite = company.website;
                body.urlImg = company.website+"/assets/images/email-signature.png";  

                //configura todo o body da requisição
                Meteor.call('configureRequest', body, customer.email, "order-cancel", company.mails.comercial, function(err, r){
                    if(err){
                        return {
                            statusCode: 404,
                            data: { status: 'fail', message: err.message }
                        };                          
                    }
                });  

                return {
                    status: 'success',
                    data: 'Mensagem enviada com sucesso.'
                };                      
            }           
        }, // end POST
        options: function() {
            return {};
        }
    });  

    // Functions

    // configura os padrões para o e-mail de contato
    function configureContact(body){
        var email = {
            company: body.empresa,
            firstname: body.name,
            whatsapp: body.phone,
            contactEmail: body.email,
            message: body.message
        };
        return email;
    }

    function configureStatus(order, cancel){

        var dateFormat = "DD/MM/YYYY HH:mm:ss",
            body = {},
            status = {};            

            order.status.forEach(function(stat){
                if(stat.time)
                    status = stat;
            });

            // se não for cancelamento, puxa todos os dados
            body = (!cancel) ? {
                company: order.customer.company.name,
                firstname: order.customer.firstname,
                orderNumber: order.number,
                orderStatus: status.name,
                orderMessage: status.message,
                orderTime: moment(status.time).format(dateFormat)
            } : {
                company: order.customer.company.name,
                firstname: order.customer.name,
                orderNumber: order.number
            };
            
        return body;
    }

    /**
     * Seta o usuário para logado
     * 
     * @param {any} context 
     */
    function setUser(context){
        context.userId = context.request.headers['x-user-id'];

        if (context.userId)
            context.user = Meteor.users.findOne(context.userId);
    }

    // Methods

    Meteor.methods({
        // configura o objeto que será enviado na requisição
        configureRequest : function(substitution_data, to, template_id, from_mail){

            // quebra o email de envio em duas partes para o sparkpost
            substitution_data["from_init"] = from_mail.split('@')[0];
            substitution_data["from_end"] = from_mail.split('@')[1];

            // configura o data
        	var data = {
    		  "campaign_id": "postman_metadata_example",
    		  "recipients": [
    		    {
    		      "address": to,
    		      "substitution_data": substitution_data
    		    }
    		  ],
    		  "content": {
    		    "template_id": template_id
    		  }
    		};

            //configura o header de autenticação
            var headers = {Authorization: authorization};

            Meteor.http.call(
                'POST', 
                'https://api.sparkpost.com/api/v1/transmissions',
                {data:data, headers:headers},
                function(res){
                    console.log(res);
                }
            );

        }
    });
}
