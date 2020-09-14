// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See api-adm-tests.js for an example of importing.
export const name = 'api-adm';

if (Meteor.isServer) {

    // Auth API configuration
    var Api = new Restivus({
        apiPath: 'adm/',
        defaultHeaders: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, X-User-Id, X-Auth-Token',
            'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS, PATCH, POST, PUT',
            'Content-Type': 'application/json'
        },
        enableCors: false,
        prettyJson: true
    });

    // Users
    // =============================================================================

    // Maps to: /adm/users
    Api.addRoute('users', { authRequired: true }, {
        // Insere novo User
        post: {
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var user = this.bodyParams;

                // Verifica de 'username' já existe
                if (Meteor.users.findOne({ 'emails.address': user.email })) {
                    return {
                        statusCode: 304,
                        body: { status: 'fail', message: 'Usuário já existe.' }
                    };
                }

                //Recebe os campos mantidos
                user.profile = user.profile;

                // Cria o Array de emails
                user.emails = [{
                    "address": user.email,
                    "verified": false
                }];

                user.username = user.email; // Adiciona 'email' como 'username'

                var userId = Accounts.createUser(user); // Insere novo User

                Roles.addUsersToRoles(userId, user.roles); // Adiciona User ao Role 'customer'

                return {
                    status: 'success',
                    data: getUserFields(userId)
                };
            },
            options: function() {
                return {};
            }
        }, // end POST
        get: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var params = this.queryParams,
                    query = {};

                //se o filtro email tiver sido enviado, adiciona na query
                if (params.email)
                    query.username = params.email;

                var user = getUserFields(false, query);

                // se encontrar um usuário, retornar
                if (user.length > 0) {
                    return {
                        status: 'success',
                        data: user
                    };
                } else {
                    // se não, erro
                    return {
                        statusCode: 404,
                        body: { status: 'fail', message: 'Usuário não encontrado.' }
                    };
                }
            },
            options: function() {
                return {};
            }
        }, // end GET
    });

    // Maps to: /adm/users/:id
    Api.addRoute('users/:id', { authRequired: true }, {
        get: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                // Pega o id da url
                var id = this.urlParams.id,
                    user = {};

                // busca usuário no banco
                user = getUserFields(id);

                // se for encontrado retorna
                if (user) {
                    return {
                        status: "success",
                        data: user
                    }
                }

                // se não, erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Usuário não encontrado.' }
                };

            },
            options: function() {
                return {};
            }
        }, // end GET        
        put: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var id = this.urlParams.id,
                    user = this.bodyParams;

                // se for encontrado atualiza
                if (getUserFields(id)) {

                    //Recebe os campos mantidos
                    user.profile = user.profile;

                    // Cria o Array de emails
                    user.emails = [{
                        "address": user.email,
                        "verified": false
                    }];

                    user.username = user.email; // Adiciona 'email' como 'username'

                    // Atualiza o registro no banco
                    Meteor.users.update({
                        _id: id
                    }, {
                        $set: user
                    });
                    // Retorna mensagem de sucesso
                    return {
                        status: "success",
                        data: getUserFields(id)
                    }
                }

                // se não, erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Usuário não encontrado.' }
                };
            },
            options: function() {
                return {};
            }
        },
        delete: {
            // Regras permitidas
            roleRequired: ['super-admin'],
            action: function() {
                var id = this.urlParams.id;

                // Verifica se o usuário existe
                if (getUserFields(id)) {

                    // Remove o user
                    Meteor.users.remove({ _id: id });

                    return {
                        statusCode: 204,
                        body: { status: 'success', message: 'Usuário excluído com sucesso.' }
                    }

                }

                // Retorna um erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Usuário não encontrado.' }
                };
            },
            options: function() {
                return {};
            }
        } // end DELETE
    });

    // Maps to: /adm/users/:id/block
    Api.addRoute('users/:id/block', { authRequired: true }, {
        post: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var id = this.urlParams.id;

                if (getUserFields(id)) {
                    // Bloqueia o user
                    Meteor.users.update({
                        _id: id
                    }, {
                        $set: { 'profile.blocked': 1 }
                    });

                    return {
                        status: 'success',
                        data: getUserFields(id)
                    }
                }

                // Retorna um erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Usuário não encontrado.' }
                };

            },
            options: function() {
                return {};
            }
        }
    });

    // Maps to: /adm/users/:id/unblock
    Api.addRoute('users/:id/unblock', { authRequired: true }, {
        post: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var id = this.urlParams.id;

                if (getUserFields(id)) {
                    // Bloqueia o user
                    Meteor.users.update({
                        _id: id
                    }, {
                        $set: { 'profile.blocked': 0 }
                    });

                    return {
                        status: 'success',
                        data: getUserFields(id)
                    }
                }

                // Retorna um erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Usuário não encontrado.' }
                };

            },
            options: function() {
                return {};
            }
        }
    });

    // Plans
    // =============================================================================

    // Maps to: /adm/plans
    Api.addRoute('plans', { authRequired: true }, {
        post: {
            // Insere novo Plan
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var plan = this.bodyParams;

                // Verifica de 'plano' já existe
                if (Plans.findOne({ name: plan.name })) {
                    return {
                        statusCode: 304,
                        body: { status: 'fail', message: 'Plano já existe.' }
                    };
                }

                // Insere o novo plano
                var id = Plans.insert(plan);

                return {
                    status: 'success',
                    data: Plans.findOne({ _id: id })
                };
            },
            options: function() {
                return {};
            }
        }, // end POST
        get: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                return {
                    status: 'success',
                    data: Plans.find({}).fetch()
                };
            },
            options: function() {
                return {};
            }
        }, // end GET
    });

    // Maps to: /adm/plans/:id
    Api.addRoute('plans/:id', { authRequired: true }, {
        get: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                // Pega o id da url
                var id = this.urlParams.id;

                // busca o plano no banco
                plan = Plans.findOne({ _id: id });

                // se for encontrado retorna
                if (plan) {
                    return {
                        status: "success",
                        data: plan
                    }
                }

                // se não, erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Plano não encontrado.' }
                };

            },
            options: function() {
                return {};
            }
        }, // end GET      
        put: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var id = this.urlParams.id,
                    plan = this.bodyParams;

                // se for encontrado atualiza
                if (Plans.findOne({ _id: id })) {

                    // Atualiza o registro no banco
                    Plans.update({
                        _id: id
                    }, {
                        $set: plan
                    });
                    // Retorna mensagem de sucesso
                    return {
                        status: "success",
                        data: Plans.findOne({ _id: id })
                    }
                }

                // se não, erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Plano não encontrado.' }
                };
            },
            options: function() {
                return {};
            }
        },
        delete: {
            // Regras permitidas
            roleRequired: ['super-admin'],
            action: function() {
                var id = this.urlParams.id;

                // Verifica se o plano existe
                if (Plans.findOne({ _id: id })) {

                    // Remove o plano
                    Plans.remove({ _id: id });

                    return {
                        statusCode: 204,
                        body: { status: 'success', message: 'Plano excluído com sucesso.' }
                    }

                }

                // Retorna um erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Plano não encontrado.' }
                };
            },
            options: function() {
                return {};
            }
        } // end DELETE
    });

    // Companies
    // =============================================================================

    // Maps to: /adm/companies
    Api.addRoute('companies', { authRequired: true }, {
        post: {
            // Insere novo User
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var company = this.bodyParams;

                // Verifica se 'username' já existe
                if (Companies.findOne({ 'username': company.username })) {
                    return {
                        statusCode: 304,
                        body: { status: 'fail', message: 'Empresa já existe.' }
                    };
                }

                var companyId = Companies.insert(company);

                return {
                    status: 'success',
                    data: Companies.findOne({ _id: companyId })
                };
            },
            options: function() {
                return {};
            }
        }, // end POST
        get: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                return {
                    status: 'success',
                    data: Companies.find({}).fetch()
                };
            },
            options: function() {
                return {};
            }
        }, // end GET
    });

    // Maps to: /adm/companies/:companyId
    Api.addRoute('companies/:companyId', { authRequired: true }, {
        get: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                // Pega o id da url
                var id = this.urlParams.companyId,
                    company = {};

                // busca usuário no banco
                company = Companies.findOne({ _id: id });

                // se for encontrado retorna
                if (company) {
                    return {
                        status: "success",
                        data: company
                    }
                }

                // se não, erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Empresa não encontrada.' }
                };

            },
            options: function() {
                return {};
            }
        }, // end GET
        put: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var id = this.urlParams.companyId,
                    company = this.bodyParams;

                // se for encontrado atualiza
                if (Companies.findOne({ _id: id })) {

                    // Atualiza o registro no banco
                    Companies.update({
                        _id: id
                    }, {
                        $set: company
                    });
                    // Retorna mensagem de sucesso
                    return {
                        status: "success",
                        data: Companies.findOne({ _id: id })
                    }
                }

                // se não, erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Empresa não encontrada.' }
                };
            },
            options: function() {
                return {};
            }
        },
        delete: {
            // Regras permitidas
            roleRequired: ['super-admin'],
            action: function() {
                var id = this.urlParams.companyId;

                // Verifica se a empresa existe
                if (Companies.findOne({ _id: id })) {

                    // Remove a empresa
                    Companies.remove({ _id: id });

                    return {
                        statusCode: 204,
                        body: { status: 'success', message: 'Empresa excluída com sucesso.' }
                    }

                }

                // Retorna um erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Empresa não encontrada.' }
                };
            },
            options: function() {
                return {};
            }
        } // end DELETE
    });

    // Maps to: /adm/companies/:companyId/block
    Api.addRoute('companies/:companyId/block', { authRequired: true }, {
        post: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var id = this.urlParams.companyId;

                if (Companies.findOne({ _id: id })) {
                    // Bloqueia o user
                    Companies.update({
                        _id: id
                    }, {
                        $set: { blocked: 1 }
                    });

                    return {
                        status: 'success',
                        data: Companies.findOne({ _id: id })
                    }
                }

                // Retorna um erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Empresa não encontrada.' }
                };
            },
            options: function() {
                return {};
            }
        }
    });

    // Maps to: /adm/companies/:companyId/unblock
    Api.addRoute('companies/:companyId/unblock', { authRequired: true }, {
        post: {
            // Regras permitidas
            roleRequired: ['super-admin', 'admin'],
            action: function() {
                var id = this.urlParams.companyId;

                if (Companies.findOne({ _id: id })) {
                    // Bloqueia o user
                    Companies.update({
                        _id: id
                    }, {
                        $set: { blocked: 0 }
                    });

                    return {
                        status: 'success',
                        data: Companies.findOne({ _id: id })
                    }
                }

                // Retorna um erro
                return {
                    statusCode: 404,
                    body: { status: 'fail', message: 'Empresa não encontrada.' }
                };
            },
            options: function() {
                return {};
            }
        }
    });

    // Functions
    // =============================================================================

    // Função para retornar um usuário ou todos de usuários configurados
    function getUserFields(id, query) {
        // Se id for enviado, retorna um objeto
        if (id) {
            return Meteor.users.findOne({ _id: id }, {
                fields: {
                    createdAt: 1,
                    emails: 1,
                    profile: 1,
                    username: 1,
                    roles: 1
                }
            });
        } else { // se não, retorna todos
            return Meteor.users.find(query, {
                fields: {
                    createdAt: 1,
                    emails: 1,
                    profile: 1,
                    username: 1,
                    roles: 1
                }
            }).fetch();
        }
    }

}
