// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See api-customers-tests.js for an example of importing.
export const name = "api-customers";

if (Meteor.isServer) {
    // Auth API configuration
    var Api = new Restivus({
        apiPath: "customers/",
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

    // Customers
    // =============================================================================

    Api.addRoute(
        "mailing",
        { authRequired: false },
        {
            get: {
                action: function() {
                    const customers = Customers.find(
                        { companies: "T8b7jMLWibW2sjAo6" },
                        {
                            fields: {
                                email: 1,
                                firstname: 1,
                                lastname: 1,
                                phone: 1
                            }
                        }
                    ).fetch();

                    const r = customers
                        .map((customer) => {
                            return `${customer.firstname}   ${
                                customer.lastname
                            }   ${customer.email}   ${customer.phone}`;
                        })
                        .join("\r\n");

                    return r;
                }
            }
        }
    );

    // Maps to: /check
    Api.addRoute(
        "check",
        { authRequired: false },
        {
            get: {
                action: function() {
                    var email = this.queryParams.email;

                    // Seta usuário logado
                    setUser(this);

                    // Encontra Customer com o Email
                    var customer = Customers.findOne(
                        {
                            email: email
                        },
                        {
                            fields: {
                                companies: 1,
                                email: 1,
                                firstname: 1,
                                lastname: 1,
                                phone: 1,
                                document: 1
                            }
                        }
                    );

                    // Body Response se Customer não encontrado ou não pertence à Company
                    var body = {
                        status: "fail",
                        message: "Cliente não encontrado."
                    };

                    // Se Customer encontrado
                    if (customer) {
                        // Valida se ele pertence à Company
                        var isCompanyCustomer =
                            customer.companies.indexOf(
                                this.user.profile.company.companyId
                            ) > -1;

                        // Remove companies do objeto customer
                        delete customer.companies;

                        // Adicionar customer ao Body Response
                        body.customer = customer;
                    }

                    // Se Customer exitir se pertencer à Company
                    if (customer && isCompanyCustomer) {
                        return {
                            status: "success",
                            data: customer
                        };
                    }

                    // Se Customer não existir
                    // ou existir e não pertencer à Company
                    return {
                        statusCode: 404,
                        body: body
                    };
                }
            },
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /customers
    Api.addRoute(
        "customers",
        { authRequired: false },
        {
            // Insere novo Customer
            post: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var customer = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // Verifica se 'company' já possui tags
                    if (
                        Customers.findOne({
                            companyId: companyId,
                            email: customer.email
                        })
                    ) {
                        return {
                            statusCode: 304,
                            body: {
                                status: "fail",
                                message:
                                    "Empresa já possui um cliente com esse email."
                            }
                        };
                    }

                    // faz o usuário receber o id da empresa
                    customer.companies = [companyId];

                    var id = Customers.insert(customer);

                    return {
                        status: "success",
                        data: Customers.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        query = {
                            companies: {
                                $in: [this.user.profile.company.companyId]
                            }
                        };

                    // busca os registros
                    var customers = Customers.find(query).fetch();

                    return {
                        status: "success",
                        data: customers
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /customers/:param
    Api.addRoute(
        "customers/:param",
        { authRequired: false },
        {
            get: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    // Pega o id da url
                    var param = this.urlParams.param,
                        customer = {};

                    // busca a tag no banco
                    customer = Customers.findOne({ _id: param });
                    if (!customer)
                        customer = Customers.findOne({ email: param });

                    // se for encontrado retorna
                    if (customer) {
                        return {
                            status: "success",
                            data: customer
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cliente não encontrado."
                        }
                    };
                }
            }, // end GET
            put: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var param = this.urlParams.param,
                        customer = this.bodyParams,
                        query = { _id: param };

                    // tenta buscar pelo id
                    var oldCustomer = Customers.findOne({ _id: param });

                    // se não encontrar, tenta buscar pelo email
                    if (!oldCustomer) {
                        oldCustomer = Customers.findOne({ email: param });
                        // modifica a query de pesquisa
                        query = { email: param };
                    }

                    // se for encontrado atualiza
                    if (oldCustomer) {
                        Customers.update(query, {
                            $set: customer
                        });

                        // pega o novo email
                        query.email = customer.email || oldCustomer.email;

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Customers.findOne(query)
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cliente não encontrado."
                        }
                    };
                }
            }, // end PUT
            patch: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var param = this.urlParams.param,
                        customer = this.bodyParams,
                        query = { _id: param };

                    // tenta buscar pelo id
                    var oldCustomer = Customers.findOne({ _id: param });

                    // se não encontrar, tenta buscar pelo email
                    if (!oldCustomer) {
                        oldCustomer = Customers.findOne({ email: param });
                        // modifica a query de pesquisa
                        query = { email: param };
                    }

                    // se for encontrado atualiza
                    if (oldCustomer) {
                        Customers.update(query, {
                            $push: { companies: customer.company }
                        });

                        // pega o novo email
                        query.email = customer.email || oldCustomer.email;

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Customers.findOne(query)
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cliente não encontrado."
                        }
                    };
                }
            }, // end PUT
            delete: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var param = this.urlParams.param,
                        query = { _id: param };

                    var customer = Customers.findOne(query);
                    if (!customer) {
                        query = { email: param };
                        customer = Customers.findOne(query);
                    }

                    // Verifica se o registro existe
                    if (customer) {
                        // Remove o registro
                        Customers.remove(query);

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Cliente excluído com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cliente não encontrado."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // me/customers
    // =============================================================================

    // Maps to: /customers/me
    Api.addRoute(
        "me",
        { authRequired: true },
        {
            get: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    // Pega o id da url
                    var customer = Customers.findOne({
                        _id: this.user.profile.customerId
                    });

                    // se for encontrado retorna
                    if (customer) {
                        return {
                            status: "success",
                            data: customer
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cliente não encontrado."
                        }
                    };
                }
            }, // end GET
            put: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var customer = this.bodyParams;
                    oldCustomer = Customers.findOne({
                        _id: this.user.profile.customerId
                    });

                    // se for encontrado atualiza
                    if (oldCustomer) {
                        Customers.update(
                            {
                                _id: oldCustomer._id
                            },
                            {
                                $set: customer
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Customers.findOne({
                                _id: this.user.profile.customerId
                            })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cliente não encontrado."
                        }
                    };
                }
            }, // end PUT
            patch: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var customer = this.bodyParams;
                    oldCustomer = Customers.findOne({
                        _id: this.user.profile.customerId
                    });

                    // se for encontrado atualiza
                    if (oldCustomer) {
                        Customers.update(
                            {
                                _id: oldCustomer._id
                            },
                            {
                                $push: { companies: customer.company }
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Customers.findOne({
                                _id: this.user.profile.customerId
                            })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cliente não encontrado."
                        }
                    };
                }
            }, // end PATCH
            options: function() {
                return {};
            }
        }
    );

    // Addresses
    // =============================================================================

    // Maps to: /:customerId/addresses
    Api.addRoute(
        ":customerId/addresses",
        { authRequired: false },
        {
            // Insere novo Customer
            post: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var address = this.bodyParams,
                        companyId = this.user.profile.company.companyId,
                        customerId = this.urlParams.customerId;

                    // faz o usuário receber o id da empresa
                    address.customerId = customerId;

                    var id = Addresses.insert(address);

                    return {
                        status: "success",
                        data: Addresses.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var customerId = this.urlParams.customerId,
                        query = { customerId: customerId },
                        params = this.queryParams;

                    if (params.zipcode) query.zipcode = params.zipcode;

                    // busca os registros
                    var addresses = Addresses.find(query).fetch();

                    // se a quantidade for maior que 0 e nenhum parâmetro for enviado, retorna
                    if (addresses.length > 0 || !params.zipcode) {
                        return {
                            status: "success",
                            data: addresses
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /:customerId/addresses/:id
    Api.addRoute(
        ":customerId/addresses/:id",
        { authRequired: false },
        {
            get: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    // Pega o id da url
                    var params = this.urlParams,
                        address = {};

                    // busca a tag no banco
                    address = Addresses.findOne({ _id: params.id });

                    // se for encontrado retorna
                    if (address) {
                        return {
                            status: "success",
                            data: address
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end GET
            put: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        newAddress = this.bodyParams;

                    // se for encontrado atualiza
                    if (Addresses.findOne({ _id: id })) {
                        //pega também o id do cliente
                        newAddress.customerId = this.urlParams.customerId;

                        Addresses.update(
                            {
                                _id: id
                            },
                            {
                                $set: newAddress
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Addresses.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end PUT
            delete: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        query = { _id: id };

                    var address = Addresses.findOne(query);

                    // Verifica se o registro existe
                    if (address) {
                        // Remove o registro
                        Addresses.remove(query);

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Endereço excluído com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /:customerId/addresses/:id/confirm
    Api.addRoute(
        ":customerId/addresses/:id/confirm",
        { authRequired: true },
        {
            // Confirma um endereço
            post: {
                // Regras permitidas
                roleRequired: [
                    "super-admin",
                    "admin",
                    "manager",
                    "sales",
                    "financial"
                ],
                action: function() {
                    var companyId = this.user.profile.company.companyId,
                        params = this.urlParams;

                    var result = Addresses.update(
                        {
                            _id: params.id
                        },
                        {
                            $set: { confirmed: true }
                        }
                    );

                    if (result) {
                        return {
                            status: "success",
                            data: Addresses.findOne({ _id: params.id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end POST
            options: function() {
                return {};
            }
        }
    );

    // me/addresses
    // =============================================================================

    // Maps to: /me/addresses
    Api.addRoute(
        "me/addresses",
        { authRequired: true },
        {
            // Insere novo Customer
            post: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var address = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // remove o id caso venha na requisição
                    if (address._id) delete address._id;

                    // remove os headers da requisição
                    address = removeHeaders(address);

                    // faz o usuário receber o id da empresa
                    address.customerId = this.user.profile.customerId;

                    var id = Addresses.insert(address);

                    return {
                        status: "success",
                        data: Addresses.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var query = { customerId: this.user.profile.customerId },
                        params = this.queryParams;

                    if (params.zipcode) query.zipcode = params.zipcode;

                    // busca os registros
                    var addresses = Addresses.find(query).fetch();

                    // se a quantidade for maior que 0 e nenhum parâmetro for enviado, retorna
                    if (addresses.length > 0 || !params.zipcode) {
                        return {
                            status: "success",
                            data: addresses
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /me/addresses/:id
    Api.addRoute(
        "me/addresses/:id",
        { authRequired: true },
        {
            get: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    // Pega o id da url
                    var params = this.urlParams,
                        address = {};

                    // busca a tag no banco
                    address = Addresses.findOne({
                        _id: params.id,
                        customerId: this.user.profile.customerId
                    });

                    // se for encontrado retorna
                    if (address) {
                        return {
                            status: "success",
                            data: address
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end GET
            put: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var id = this.urlParams.id,
                        newAddress = this.bodyParams;

                    // remove os headers da requisição
                    newAddress = removeHeaders(newAddress);

                    // se for encontrado atualiza
                    if (
                        Addresses.findOne({
                            _id: id,
                            customerId: this.user.profile.customerId
                        })
                    ) {
                        //pega também o id do cliente
                        newAddress.customerId = this.user.profile.customerId;

                        Addresses.update(
                            {
                                _id: id
                            },
                            {
                                $set: newAddress
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Addresses.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end PUT
            delete: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var id = this.urlParams.id,
                        query = {
                            _id: id,
                            customerId: this.user.profile.customerId
                        };

                    var address = Addresses.findOne(query);

                    // Verifica se o registro existe
                    if (address) {
                        // Remove o registro
                        Addresses.remove(query);

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Endereço excluído com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /me/addresses/:id/confirm
    Api.addRoute(
        "me/addresses/:id/confirm",
        { authRequired: true },
        {
            // Confirma um endereço
            post: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var companyId = this.user.profile.company.companyId,
                        params = this.urlParams;

                    var result = Addresses.update(
                        {
                            _id: params.id,
                            customerId: this.user.profile.customerId
                        },
                        {
                            $set: { confirmed: true }
                        }
                    );

                    if (result) {
                        return {
                            status: "success",
                            data: Addresses.findOne({ _id: params.id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Endereço não encontrado."
                        }
                    };
                }
            }, // end POST
            options: function() {
                return {};
            }
        }
    );

    // Orders
    // =============================================================================

    // Maps to: /:customerId/orders
    Api.addRoute(
        ":customerId/orders",
        { authRequired: false },
        {
            // Insere novo Customer
            post: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var order = this.bodyParams,
                        company = this.user.profile.company,
                        customerId = this.urlParams.customerId;

                    // recebe a company
                    order.company = {
                        companyId: company.companyId,
                        name: company.name
                    };

                    var customer = Customers.findOne({ _id: customerId });

                    // faz o usuário receber o id da empresa
                    order.customer = {
                        customerId: customerId,
                        name: customer.name
                    };

                    // gera o array de status
                    order.status = [];

                    // incrementa o contador
                    order.i =
                        Orders.find({
                            "company.companyId": company.companyId
                        }).count() + 1;

                    var id = Orders.insert(order);

                    return {
                        status: "success",
                        data: Orders.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var customerId = this.urlParams.customerId,
                        query = {
                            "customer.customerId": customerId,
                            companyId: this.user.profile.company.companyId
                        };
                    // busca os registros
                    var orders = Checkouts.find(query).fetch();

                    // se a quantidade for maior que 0 e nenhum parâmetro for enviado, retorna
                    if (orders) {
                        return {
                            status: "success",
                            data: orders
                        };
                    }
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /:customerId/orders/:id
    Api.addRoute(
        ":customerId/orders/:id",
        { authRequired: false },
        {
            get: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    // Pega o id da url
                    var params = this.urlParams,
                        order = {},
                        customerId = params.customerId;

                    // busca a tag no banco
                    order = Checkouts.findOne({
                        _id: params.id,
                        orderNumber: { $exists: 1 },
                        "customer.customerId": customerId
                    });

                    // se for encontrado retorna
                    if (order) {
                        return {
                            status: "success",
                            data: order
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Pedido não encontrado."
                        }
                    };
                }
            }, // end GET
            put: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        newOrder = this.bodyParams;

                    var order = Orders.findOne({
                        _id: id,
                        "customer.customerId": this.urlParams.customerId
                    });

                    // se for encontrado atualiza
                    if (order) {
                        // atualiza a data dos status
                        if (newOrder.status) {
                            newOrder.status.forEach(function(status) {
                                status.addededAt = new Date();
                            });
                        } else newOrder.status = order.status;

                        // recebe os parâmetros antigos
                        newOrder.customer = order.customer;
                        newOrder.company = order.company;

                        Orders.update(
                            {
                                _id: id
                            },
                            {
                                $set: newOrder
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Orders.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Pedido não encontrado."
                        }
                    };
                }
            }, // end PUT
            patch: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        status = this.bodyParams;

                    var order = Orders.findOne({
                        _id: id,
                        "customer.customerId": this.urlParams.customerId
                    });

                    // se for encontrado atualiza
                    if (order) {
                        // atualiza a data dos status
                        status.addededAt = new Date();

                        Orders.update(
                            {
                                _id: id
                            },
                            {
                                $push: { status: status }
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Orders.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Pedido não encontrado."
                        }
                    };
                }
            }, // end PATCH
            delete: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        query = { _id: id };

                    var order = Orders.findOne(query);

                    // Verifica se o registro existe
                    if (order) {
                        // Remove o registro
                        Orders.remove(query);

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Pedido excluído com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Pedido não encontrado."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /:customerId/orders/:id/cancel
    Api.addRoute(
        ":customerId/orders/:id/cancel",
        { authRequired: false },
        {
            put: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        customerId = this.urlParams.customerId;

                    var order = Orders.findOne({
                        _id: id,
                        "customer.customerId": customerId
                    });

                    // se for encontrado atualiza
                    if (order) {
                        Orders.update(
                            {
                                _id: id
                            },
                            {
                                $set: { canceled: true }
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Orders.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Pedido não encontrado."
                        }
                    };
                }
            }, // end PUT
            options: function() {
                return {};
            }
        }
    );

    // me/orders
    // =============================================================================

    // Maps to: /me/orders
    Api.addRoute(
        "me/orders",
        { authRequired: true },
        {
            get: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var customerId = this.user.profile.customerId,
                        query = {
                            orderNumber: { $exists: 1 },
                            "customer.customerId": customerId,
                            companyId: this.user.profile.company.companyId
                        };
                    // busca os registros
                    var orders = Checkouts.find(query).fetch();

                    // se a quantidade for maior que 0 e nenhum parâmetro for enviado, retorna
                    if (orders) {
                        return {
                            status: "success",
                            data: orders
                        };
                    }
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // me/carts
    // =============================================================================

    // Maps to: /me/carts
    Api.addRoute(
        "me/carts",
        { authRequired: true },
        {
            get: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var customerId = this.user.profile.customerId,
                        query = {
                            orderNumber: { $exists: 0 },
                            "customer.customerId": customerId,
                            companyId: this.user.profile.company.companyId
                        };

                    var queryParams = this.queryParams;

                    if (queryParams && queryParams.dateLimit)
                        query.createdAt = {
                            $gte: new Date(
                                moment()
                                    .add(queryParams.dateLimit * -1, "days")
                                    .format()
                            )
                        };

                    // busca os registros
                    var carts = Checkouts.find(query).fetch();

                    // se a quantidade for maior que 0 e nenhum parâmetro for enviado, retorna
                    if (carts) {
                        return {
                            status: "success",
                            data: carts
                        };
                    }
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /me/orders/last
    Api.addRoute(
        "me/orders/last",
        { authRequired: true },
        {
            get: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var customerId = this.user.profile.customerId,
                        query = {
                            "customer.customerId": customerId,
                            companyId: this.user.profile.company.companyId
                        };

                    // busca os registros
                    var order = Checkouts.findOne(query, {
                        sort: { number: -1 }
                    });

                    // se a quantidade for maior que 0 retorna
                    if (order) {
                        return {
                            status: "success",
                            data: order
                        };
                    } else {
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message: "Pedido não encontrado."
                            }
                        };
                    }
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /me/orders/:id
    Api.addRoute(
        "me/orders/:id",
        { authRequired: true },
        {
            get: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    // Pega o id da url
                    var params = this.urlParams,
                        order = {},
                        customerId = this.user.profile.customerId;

                    // busca o objeto no banco
                    order = Checkouts.findOne({
                        _id: params.id,
                        orderNumber: { $exists: 1 },
                        "customer.customerId": customerId
                    });

                    // se for encontrado retorna
                    if (order) {
                        return {
                            status: "success",
                            data: order
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Pedido não encontrado."
                        }
                    };
                }
            }, // end GET
            put: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var id = this.urlParams.id,
                        newOrder = this.bodyParams;

                    var order = Orders.findOne({
                        _id: id,
                        "customer.customerId": this.user.profile.customerId
                    });

                    // se for encontrado atualiza
                    if (order) {
                        // atualiza a data dos status
                        if (newOrder.status) {
                            newOrder.status.forEach(function(status) {
                                status.addededAt = new Date();
                            });
                        } else newOrder.status = order.status;

                        // recebe os parâmetros antigos
                        newOrder.customer = order.customer;
                        newOrder.company = order.company;

                        Orders.update(
                            {
                                _id: id
                            },
                            {
                                $set: newOrder
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Orders.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Pedido não encontrado."
                        }
                    };
                }
            }, // end PUT
            patch: {
                // Regras permitidas
                roleRequired: ["customer"],
                action: function() {
                    var id = this.urlParams.id,
                        status = this.bodyParams;

                    var order = Orders.findOne({
                        _id: id,
                        "customer.customerId": this.user.profile.customerId
                    });

                    // se for encontrado atualiza
                    if (order) {
                        // atualiza a data dos status
                        status.addededAt = new Date();

                        Orders.update(
                            {
                                _id: id
                            },
                            {
                                $push: { status: status }
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Orders.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Pedido não encontrado."
                        }
                    };
                }
            }, // end PATCH
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /me/orders/:id/cancel
    Api.addRoute(
        "me/orders/:id/cancel",
        { authRequired: false },
        {
            put: {
                action: function() {
                    // Seta usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        customerId = this.user.profile.customerId;

                    var order = Orders.findOne({
                        _id: id,
                        "customer.customerId": customerId
                    });

                    // se for encontrado atualiza
                    if (order) {
                        Orders.update(
                            {
                                _id: id
                            },
                            {
                                $set: { canceled: true }
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Orders.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Pedido não encontrado."
                        }
                    };
                }
            }, // end PUT
            options: function() {
                return {};
            }
        }
    );

    // Functions

    function removeHeaders(address) {
        delete address.config;
        delete address.statusText;
        delete address.status;
        delete address.data;
        return address;
    }

    /**
     * Seta o usuário para logado
     *
     * @param {any} context
     */
    function setUser(context) {
        context.userId = context.request.headers["x-user-id"];

        if (context.userId) context.user = Meteor.users.findOne(context.userId);
    }

    // Methods

    Meteor.methods({
        // configura o objeto que será enviado na requisição
        checkCustomer: function(email, user) {
            // verifica se existe um customer
            var customer = Customers.findOne({ email: email });

            // se o customer existir, retorna o id
            if (customer) {
                // adiciona o company id para esse customer
                Customers.update(
                    {
                        _id: customer._id
                    },
                    {
                        $push: { companies: user.company.companyId }
                    }
                );

                return customer._id;
            }

            // se não, insere e retorna o id
            return Customers.insert({
                email: email,
                companies: [user.company.companyId],
                name: user.name,
                phone: user.phone
            });
        }
    });
}
