// LojaInteligente API Auth

export const name = 'api-auth';

if (Meteor.isServer) {

    // Auth API configuration
    var Api = new Restivus({
        apiPath: 'auth/',
        defaultHeaders: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, X-User-Id, X-Auth-Token',
            'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS, PATCH, POST, PUT',
            'Content-Type': 'application/json'
        },
        enableCors: false,
        prettyJson: true
    });

    // Maps to: /auth/check
    Api.addRoute('check', { authRequired: false }, {
        get: function() {
            var email = this.bodyParams.email;

            // Checa se User está logado
            var user = Meteor.users.findOne({
                _id: this.request.headers['x-user-id'],
                $or: [
                    {'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(this.request.headers['x-auth-token'])},
                    {'profile.token': this.request.headers['x-auth-token'] },
                ]
            }, {
                fields: {
                    profile: 1,
                    roles: 1
                }
            });

            // Se não estiver logado
            if (!user) {
                return {
                    statusCode: 401,
                    body: { status: 'fail', message: 'Não autorizado.' }
                };
            }

            // Se estiver logado
            return {
                status: 'success',
                data: user
            };
        },
        post: function() {
            var email = this.bodyParams.email;

            this.userId = this.request.headers['x-user-id'];

            if (this.userId)
                this.user = Meteor.users.findOne(this.userId);            

            // Confere se usuário existe pelo email
            var user = Meteor.users.findOne({
                username: email + ':' + this.user.profile.company.username
            });

            // Se usuário não for encontrado
            if (!user) {
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Usuário não encontrado.' }
                };
            }

            // Se usuário for encontrado
            return {
                status: 'success',
                data: {
                    email: email
                }
            };
        },
        options: function() {
            return {};
        }
    })

    // Maps to: /auth/login
    Api.addRoute('login', { authRequired: false }, {
        post: function() {
            // Se User estiver logado
            // adiciona ':company.username' ao email
            // Isso garante o login de Users 'api' e demais roles
            this.userId = this.request.headers['x-user-id'];

            if (this.userId)
                this.user = Meteor.users.findOne(this.userId);

            // se usuário préviamente logado for um API
            // um customer está tentando fazer login
            var username = (this.user) ? this.bodyParams.email + ':' + this.user.profile.company.username : this.bodyParams.email;

            // Verifica se User existe
            var user = Meteor.users.findOne({ username: username });

            // se não encontrou, busca como usuário normal
            if(!user)
                Meteor.users.findOne({ username: username + ':' + this.user.profile.company.username });

            if(user){
                // Se 'password' estiver incorreto
                if(this.bodyParams.password){
                    if (!checkPassword(user, this.bodyParams.password)) {
                        return {
                            statusCode: 401,
                            body: { status: 'fail', message: 'Senha incorreta.' }
                        };
                    }
                }
            }

            // Se User não existe
            // analisa
            else {
                user = this.bodyParams,
                originalEmail = this.bodyParams.email;
                var customer = Customers.findOne({email: originalEmail});

                if(!customer){
                    return {
                        statusCode: 401,
                        body: { status: 'fail', message: 'Usuário não encontrado.' }
                    };
                } else {
                    user.profile = {
                        firstname: customer.firstname,
                        lastname: customer.lastname,
                        document: customer.document,
                        phone: customer.phone,
                        customerId: customer._id,
                        company: this.user.profile.company
                    };

                    // Adiciona Company.username no email do User
                    if (user.email.indexOf(':') == -1)
                        user.email += ':' + this.user.profile.company.username;

                    // Verifica de 'username' já existe
                    if (Meteor.users.findOne({ 'emails.address': user.email })) {
                        return {
                            statusCode: 304,
                            body: { status: 'fail', message: 'Usuário já existe.' }
                        };
                    }

                    user.username = user.email; // Adiciona 'email' como 'username'
                    user.password = (Date.now() * parseInt(Math.random() * 10 + 1)).toString().substr(0, 8); // Gera um 'password' pro User

                    // se já for autenticado pelo facebook, não tem password meteor
                    if(user.facebook || user.newsletter){
                        delete user.password;
                        delete user.facebook;
                        delete user.newsletter;
                    }

                    //configura todo o body da requisição
                    var company = Companies.findOne({_id: this.user.profile.company.companyId});

                    var body = {
                        password: user.password,
                        firstname: user.profile.firstname,
                        company: user.profile.company.name,
                        linkSite: company.website,
                        urlImg: company.website+"/assets/images/email-signature.png"
                    };

                    // envia o email
                    Meteor.call('configureRequest', body, originalEmail, "welcome", company.mails.main, function(err, r) {
                        if (err) {
                            return {
                                statusCode: 404,
                                body: { status: 'fail', message: err.message }
                            };
                        }
                    });

                    user._id = Accounts.createUser(user); // Insere novo User

                    Roles.addUsersToRoles(user._id, 'customer'); // Adiciona User ao Role 'customer'

                    // Desloga usuário atual antes de fazer novo login
                    if (this.user)
                        logout(this.user, this.request.headers['x-auth-token']);
                }
            }

            var authToken = {};

            // se usuário for do tipo API
            // possui apenas 1 token
            if(user.roles.indexOf('api') > -1){
                var loginTokens = {};

                // retorna o token de acordo com as regras do usuário API
                authToken = {
                    token : user.profile.token
                };
            } else {
                authToken = Accounts._generateStampedLoginToken(); // Gera accessToken

                Accounts._insertLoginToken(user._id, authToken); // Salva accessToken para logar User
            }

            return {
                status: 'success',
                data: {
                    authToken: authToken.token,
                    userId: user._id
                }
            };
        },
        options: function() {
            return {};
        }
    });

    // Maps to: /auth/logout
    Api.addRoute('logout', { authRequired: false }, {
        post: function() {

            //seta o usuário logado
            setUser(this);            

            logout(this.user, this.request.headers['x-auth-token']);

            return {
                status: "success",
                data: {
                    message: "Você foi deslogado."
                }
            }
        },
        options: function() {
            return {};
        }
    })

    // Maps to: /auth/me
    Api.addRoute('me', { authRequired: false }, {
        // Retorna User logado
        get: function() {
            //seta o usuário logado
            setUser(this);      

            return {
                status: 'success',
                data: Meteor.users.findOne(
                    this.userId, {
                        fields: {
                            profile: 1,
                            roles: 1,
                            username: 1
                        }
                    }
                )
            };
        },
        put: function() {

            //seta o usuário logado
            setUser(this);      

            if(this.user.profile.firstName){
                this.bodyParams.profile.firstname = this.bodyParams.profile.firstName;
                delete this.bodyParams.profile.firstName;
            }
            if(this.user.profile.lastName){
                this.bodyParams.profile.lastname = this.bodyParams.profile.lastName;
                delete this.bodyParams.profile.lastName;
            }

            // atualiza os dados do user
            Meteor.users.update(this.userId,
                {
                    $set: {profile: this.bodyParams.profile}
                });

            // atualiza os dados em Customers
            Customers.update({
                _id: this.user.profile.customerId
            }, {
                $set: {
                    phone: this.bodyParams.profile.phone,
                    firstname: this.user.profile.firstname || this.user.profile.firstName,
                    lastname: this.user.profile.lastname || this.user.profile.lastName,
                    document: this.bodyParams.profile.document
                }
            });

            return {
                status: 'success',
                data: Meteor.users.findOne(this.userId)
            };
        },
        options: function() {
            return {};
        }
    });

    // Maps to: /auth/password_change
    Api.addRoute('password_change', { authRequired: true }, {
        post: function() {
            // Impede alterar senha de User no role 'api'
            if (Roles.userIsInRole(this.userId, 'api')) {
                return {
                    statusCode: 403,
                    body: { status: 'fail', message: 'Sem permissão para alterar senha deste usuário.' }
                };
            }

            // Se 'password' estiver incorreto
            if (!checkPassword(this.user, this.bodyParams.password)) {
                return {
                    statusCode: 304,
                    body: { status: 'fail', message: 'Senha incorreta.' }
                };
            }

            // Altera 'password' do User
            Accounts.setPassword(this.userId, this.bodyParams.newPassword, { logout: false });

            return {
                status: 'success',
                data: {
                    message: 'Senha alterada.'
                }
            };
        },
        options: function() {
            return {};
        }
    });

    // Maps to: /auth/register
    Api.addRoute('register', { authRequired: false }, {
        // Insere novo User como 'customer'
        post: {
            action: function() {

                //seta o usuário logado
                setUser(this);

                var user = this.bodyParams,
                    originalEmail = user.email;

                // Busca Customer pelo email
                var customer = Customers.findOne({ email: originalEmail });

                // Se Customer existe
                if (customer) {
                    // Define o customerId
                    var customerId = customer._id

                    // Atualiza Customer
                    Customers.update({
                        _id: customer._id
                    }, {
                        $set: {
                            firstname: user.firstname,
                            lastname: user.lastname,
                            document: user.document,
                            phone: user.phone,
                        },
                        $push: {
                            companies: this.user.profile.company.companyId
                        }
                    });
                } else {
                    // Define o customerId com o _id do novo Customer
                    var customerId = Customers.insert({
                        email: originalEmail,
                        companies: [this.user.profile.company.companyId],
                        firstname: user.firstname,
                        lastname: user.lastname,
                        document: user.document,
                        phone: user.phone
                    });
                }

                user.profile = {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    document: user.document,
                    phone: user.phone,
                    customerId: customerId,
                    company: this.user.profile.company
                };

                delete user.firstname;
                delete user.lastname;
                delete user.document;
                delete user.phone;

                // Adiciona Company.username no email do User
                if (user.email.indexOf(':') == -1)
                    user.email += ':' + this.user.profile.company.username;

                // Verifica de 'username' já existe
                if (Meteor.users.findOne({ 'emails.address': user.email })) {
                    return {
                        statusCode: 304,
                        body: { status: 'fail', message: 'Usuário já existe.' }
                    };
                }

                user.username = user.email; // Adiciona 'email' como 'username'
                user.password = (Date.now() * parseInt(Math.random() * 10 + 1)).toString().substr(0, 8); // Gera um 'password' pro User

                // se já for autenticado pelo facebook, não tem password meteor
                if(user.facebook || user.newsletter){
                    delete user.password;
                    delete user.facebook;
                    delete user.newsletter;
                }

                //configura todo o body da requisição
                var company = Companies.findOne({_id: this.user.profile.company.companyId});

                var body = {
                    password: user.password,
                    firstname: user.profile.firstname,
                    company: user.profile.company.name,
                    linkSite: company.website,
                    urlImg: company.website+"/assets/images/email-signature.png"
                };

                // envia o email
                Meteor.call('configureRequest', body, originalEmail, "welcome", company.mails.main, function(err, r) {
                    if (err) {
                        return {
                            statusCode: 404,
                            body: { status: 'fail', message: err.message }
                        };
                    }
                });

                var userId = Accounts.createUser(user); // Insere novo User

                Roles.addUsersToRoles(userId, 'customer'); // Adiciona User ao Role 'customer'

                // Desloga usuário atual antes de fazer novo login
                if (this.user)
                    logout(this.user, this.request.headers['x-auth-token']);

                var authToken = Accounts._generateStampedLoginToken(); // Gera accessToken

                Accounts._insertLoginToken(userId, authToken); // Salva accessToken para logar User

                return {
                    status: 'success',
                    data: {
                        authToken: authToken.token,
                        userId: userId
                    }
                };
            }
        },
        options: function() {
            return {};
        }
    });

    // Functions
    function checkPassword(user, password) {
        var digest = SHA256(password), // Criptografa o 'password'
            passwordCheck = Accounts._checkPassword(user, { digest: digest, algorithm: 'sha-256' }); // Confere se 'password' está correto

        return !passwordCheck.error;
    }

    function logout(user, token) {
        Meteor.users.update({
            _id: user._id
        }, {
            $pull: {
                'services.resume.loginTokens': {
                    hashedToken: Accounts._hashLoginToken(token) // Gera hashedToken
                }
            }
        });

        return;
    }


    /**
     * getApiToken - Retorna o token no caso de usuário API corretamente
     *
     * @param  {type} user        description
     * @param  {type} loginTokens description
     * @param  {type} authToken   description
     * @return {type}             description
     */
    function getApiToken(user, loginTokens, authToken){
        return {
            token: loginTokens[0].token
        };
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

    /**
     * updateDbToken - Atualiza o token no DB
     *
     * @param  {type} user        description
     * @param  {type} loginTokens description
     * @param  {type} authToken   description
     * @return {type}             description
     */
    function updateDbToken(user, loginTokens, authToken){
        // grava também o token para comparação
        loginTokens = [{
            hashedToken: Accounts._hashLoginToken(authToken.token),
            token: authToken.token
        }];

        Meteor.users.update({
            _id: user._id
        }, {
            $set: {
                'services.resume.loginTokens': loginTokens
            }
        });
    }
}
