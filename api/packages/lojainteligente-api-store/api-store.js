import { GoogleMerchant } from "./google-merchant";
import { MilenioRedirect } from "./milenio-redirect-data";
// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See api-store-tests.js for an example of importing.
export const name = "api-store";

if (Meteor.isServer) {
    // Auth API configuration
    var Api = new Restivus({
        apiPath: "store/",
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

    /**
     * Trata o redirecionamento das URLs de produtos antigas da Milênio para as novas
     */
    Api.addRoute(
        "milenio/:id/:title",
        { authRequired: false },
        {
            get: function() {
                var url = "https://www.mileniomoveis.com.br",
                    path = MilenioRedirect[this.urlParams.id];

                if (path) url += path;

                this.response.writeHead(302, {
                    Location: url
                });

                this.response.end();
            }
        }
    );

    // Tags
    // =============================================================================

    // Maps to: /store/tags
    Api.addRoute(
        "tags",
        { authRequired: false },
        {
            // Insere nova Tag
            post: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var tag = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // Verifica se 'company' já possui tags
                    if (
                        Tags.findOne({ companyId: companyId, name: tag.name })
                    ) {
                        return {
                            statusCode: 304,
                            body: {
                                status: "fail",
                                message:
                                    "Empresa já possui um grupo de tags com esse nome."
                            }
                        };
                    }

                    // faz a nova tag receber o companyId
                    tag.companyId = companyId;

                    var id = Tags.insert(tag);

                    return {
                        status: "success",
                        data: Tags.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        fields = ["name", "tags.name", "tags.url"];

                    if (params.group) params.name = params.group;

                    // gera a query de busca
                    var query = getQuery(params, fields, companyId);

                    var tags = Tags.find(query).fetch();

                    // se encontrou pelo menos um grupo de tags, retorna
                    if (tags.length > 0) {
                        return {
                            status: "success",
                            data: tags
                        };
                    } else {
                        // se não, retorna erro
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message: "Tags não encontradas."
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

    // Maps to: /store/tags/:id
    Api.addRoute(
        "tags/:id",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    // Pega o id da url
                    var id = this.urlParams.id,
                        tag = {};

                    // busca a tag no banco
                    tag = Tags.findOne({ _id: id });

                    // se for encontrado retorna
                    if (tag) {
                        return {
                            status: "success",
                            data: tag
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Tags não encontradas."
                        }
                    };
                }
            }, // end GET
            patch: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        tag = this.bodyParams;

                    // se for encontrado atualiza
                    if (Tags.findOne({ _id: id })) {
                        // Se o patch vier com name, atualiza o name, se não as tags
                        var update = tag.name
                            ? { name: tag.name }
                            : { tags: tag.tags };

                        Tags.update(
                            {
                                _id: id
                            },
                            {
                                $set: update
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Tags.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Tags não encontradas."
                        }
                    };
                }
            }, // end PATCH
            delete: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id;

                    // Verifica se a tag existe
                    if (Tags.findOne({ _id: id })) {
                        // Remove a tag
                        Tags.remove({ _id: id });

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Tags excluídas com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Tags não encontradas."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Items
    // =============================================================================

    // Maps to: /store/items
    Api.addRoute(
        "items",
        { authRequired: false },
        {
            // Insere novo Item
            post: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var item = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // Verifica se 'item' já existe naquela empresa
                    if (
                        Items.findOne({ companyId: companyId, name: item.name })
                    ) {
                        return {
                            statusCode: 304,
                            body: {
                                status: "fail",
                                message:
                                    "Empresa já possui um item com esse nome."
                            }
                        };
                    }

                    // faz a novo item receber o companyId
                    item.companyId = companyId;

                    var id = Items.insert(item);

                    return {
                        status: "success",
                        data: Items.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        fields = [
                            "name",
                            "name_nd",
                            "url",
                            "tags",
                            "tags.name",
                            "tags.url"
                        ],
                        queryFields = {};

                    // configura o parâmetro tag corretamente
                    if (params.tag) params["tags.name"] = params.tag;

                    queryFields = {
                        name: 1,
                        name_nd: 1,
                        url: 1,
                        pictures: 1,
                        options: 1,
                        tags: 1,
                        installments: 1,
                        attributes: 1,
                        googleShopping: 1,
                        stock: 1,
                        max: 1,
                        rank: 1,
                        code: 1,
                        recurrence: 1
                    };

                    // gera a query de busca
                    var adicionalQuery = {
                        $or: [{ active: true }, { active: 1 }]
                    };

                    var query = getQuery(
                        params,
                        fields,
                        companyId,
                        adicionalQuery
                    );

                    var items = Items.find(query, {
                        fields: queryFields
                    }).fetch();

                    // se encontrou pelo menos um item que possui tag, ou não existe parâmetro, retorna
                    if (items.length > 0) {
                        return {
                            status: "success",
                            data: items
                        };
                    } else {
                        // se não, retorna erro
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message:
                                    "Não existe itens com os parâmetros solicitados."
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

    Api.addRoute(
        "environments",
        { authRequired: false },
        {
            get: {
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        fields = [
                            "name",
                            "name_nd",
                            "url",
                            "tags",
                            "tags.name",
                            "tags.url"
                        ]

                    // configura o parâmetro tag corretamente
                    if (params.tag) params["tags.name"] = params.tag;

                    // gera a query de busca
                    var adicionalQuery = {
                        $or: [{ active: true }, { active: 1 }]
                    };
                    
                    var query = getQuery(
                        params,
                        fields,
                        companyId,
                        adicionalQuery
                    );

                    var env = Environments.find(query).fetch();

                    console.log(query);

                    // se encontrou pelo menos um item que possui tag, ou não existe parâmetro, retorna
                    if (env.length > 0) {
                        return {
                            status: "success",
                            data: env
                        };
                    } else {
                        // se não, retorna erro
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message:
                                    "Não existe ambientes com os parâmetros solicitados."
                            }
                        };
                    }
                }
            },
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /store/items/:id
    Api.addRoute(
        "items/:id",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    // Pega o id da url
                    var id = this.urlParams.id,
                        item = {};

                    // busca o item no banco
                    item = Items.findOne({ _id: id });

                    // se for encontrado retorna
                    if (item) {
                        return {
                            status: "success",
                            data: item
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Item não encontrado."
                        }
                    };
                }
            }, // end GET
            put: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        item = this.bodyParams;

                    // se for encontrado atualiza
                    if (Items.findOne({ _id: id })) {
                        Items.update(
                            {
                                _id: id
                            },
                            {
                                $set: item
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Items.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Item não encontrado."
                        }
                    };
                }
            }, // END PUT
            delete: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id;

                    // Verifica se a tag existe
                    if (Items.findOne({ _id: id })) {
                        // Remove a tag
                        Items.remove({ _id: id });

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Item excluído com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Item não encontrado."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    Api.addRoute(
        "items/:id/customizations",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        queryFields = {};

                    var item = Items.findOne({ _id: this.urlParams.id });

                    var customizations = [];

                    item.customizations.forEach(function(customization) {
                        customizations.push(
                            Customizations.findOne({ _id: customization })
                        );
                    });

                    return {
                        status: "success",
                        data: customizations
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Banners
    // =============================================================================

    // Maps to: /store/banners
    Api.addRoute(
        "banners",
        { authRequired: false },
        {
            // Insere novo Banner
            post: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var banner = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // Verifica se 'banner' já existe naquela empresa
                    if (
                        Banners.findOne({
                            companyId: companyId,
                            group: banner.group
                        })
                    ) {
                        return {
                            statusCode: 304,
                            body: {
                                status: "fail",
                                message:
                                    "Empresa já possui um grupo de banners com esse nome."
                            }
                        };
                    }

                    // faz a novo banner receber o companyId
                    banner.companyId = companyId;

                    var id = Banners.insert(banner);

                    return {
                        status: "success",
                        data: Banners.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        fields = ["group", "banners.title", "banners.link"];

                    // gera a query de busca
                    var query = getQuery(params, fields, companyId);

                    var banners = Banners.find(query).fetch();
                    banners = especificActive(banners, "banners");

                    // se encontrou o grupo de banners, retorna
                    if (banners || !params.group) {
                        return {
                            status: "success",
                            data: banners
                        };
                    } else {
                        // se não, retorna erro
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message:
                                    "Não existe grupo de banners com esse nome."
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

    // Maps to: /store/banners/:id
    Api.addRoute(
        "banners/:id",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    // Pega o id da url
                    var id = this.urlParams.id,
                        banner = {};

                    // busca o banner no banco
                    banner = Banners.findOne({ _id: id });

                    // se for encontrado retorna
                    if (banner) {
                        return {
                            status: "success",
                            data: banner
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: { status: "fail", message: "Faq não encontrado." }
                    };
                }
            }, // end GET
            patch: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        banner = this.bodyParams;

                    // se for encontrado atualiza
                    if (Banners.findOne({ _id: id })) {
                        // Verifica o que deve ser atualizado
                        var update = banner.group
                            ? { group: banner.group }
                            : { banners: banner.banners };

                        Banners.update(
                            {
                                _id: id
                            },
                            {
                                $set: update
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Banners.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Grupo de banners não encontrado."
                        }
                    };
                }
            }, // END PUT
            delete: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id;

                    // Verifica se a tag existe
                    if (Banners.findOne({ _id: id })) {
                        // Remove a tag
                        Banners.remove({ _id: id });

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message:
                                    "Grupo de banners excluído com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Grupo de banners não encontrado."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Faq
    // =============================================================================

    // Maps to: /store/faq
    Api.addRoute(
        "faq",
        { authRequired: false },
        {
            // Insere novo Faq
            post: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var faq = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // Verifica se 'faq' já existe naquela empresa
                    if (
                        Faq.findOne({
                            companyId: companyId,
                            question: faq.question
                        })
                    ) {
                        return {
                            statusCode: 304,
                            body: {
                                status: "fail",
                                message: "Empresa já possui essa pergunta."
                            }
                        };
                    }

                    // faz a novo faq receber o companyId
                    faq.companyId = companyId;
                    // pega o próximo indice
                    faq.index = Faq.find({ companyId: companyId }).count() + 1;

                    var id = Faq.insert(faq);

                    return {
                        status: "success",
                        data: Faq.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        fields = ["question", "answer"];

                    // gera a query de busca
                    var query = getQuery(params, fields, companyId),
                        faq = Faq.find(query).fetch();

                    // retorna as perguntas
                    return {
                        status: "success",
                        data: faq
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /store/faq/:id
    Api.addRoute(
        "faq/:id",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    // Pega o id da url
                    var id = this.urlParams.id,
                        faq = {};

                    // busca o faq no banco
                    faq = Faq.findOne({ _id: id });

                    // se for encontrado retorna
                    if (faq) {
                        return {
                            status: "success",
                            data: faq
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: { status: "fail", message: "Faq não encontrado." }
                    };
                }
            }, // end GET
            put: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        faq = this.bodyParams,
                        oldFaq = Faq.findOne({ _id: id });

                    // se for encontrado atualiza
                    if (oldFaq) {
                        // mantem o indice do faq
                        faq.index = oldFaq.index;

                        Faq.update(
                            {
                                _id: id
                            },
                            {
                                $set: faq
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Faq.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: { status: "fail", message: "Faq não encontrado." }
                    };
                }
            }, // END PUT
            delete: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id;

                    // Verifica se existe o registro
                    if (Faq.findOne({ _id: id })) {
                        // Remove o registro
                        Faq.remove({ _id: id });

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Faq excluído com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: { status: "fail", message: "Faq não encontrado." }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /store/faq/reorder
    Api.addRoute(
        "faq/reorder",
        { authRequired: false },
        {
            post: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var ids = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // percorre os ids anotando a ordenação
                    ids.forEach(function(id, i) {
                        Faq.update(
                            {
                                _id: id
                            },
                            {
                                $set: { index: i + 1 }
                            }
                        );
                    });

                    return {
                        status: "success",
                        data: Faq.find({ companyId: companyId }).fetch()
                    };
                }
            } // end POST
        }
    );

    // Shippings
    // =============================================================================

    // Maps to: /store/shippings
    Api.addRoute(
        "shippings",
        { authRequired: false },
        {
            // Insere novo Registro
            post: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var shipping = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // faz a novo shipping receber o companyId
                    shipping.companyId = companyId;

                    var id = Shippings.insert(shipping);

                    return {
                        status: "success",
                        data: Shippings.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        query = {
                            companyId: this.user.profile.company.companyId
                        },
                        zipcode = parseInt(this.queryParams.zipcode);

                    // verifica se existe um Cep dentro da faixa de ceps
                    if (params.zipcode) {
                        query["zipcodes.start"] = { $lte: zipcode };
                        query["zipcodes.end"] = { $gte: zipcode };
                    }

                    var shipping = Shippings.find(query, {
                        sort: {
                            rate: 1
                        }
                    }).fetch();

                    // se encontrou pelo menos um item que possui tag, ou não existe parâmetro, retorna
                    if (shipping.length > 0 || !params.zipcode) {
                        if (params.zipcode) {
                            return {
                                status: "success",
                                data: shipping[0]
                            };
                        } else {
                            return {
                                status: "success",
                                data: shipping
                            };
                        }
                    } else {
                        // se não, retorna erro
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message: "Cep não incluido na faixa de ceps."
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

    // Maps to: /store/shippings/:id
    Api.addRoute(
        "shippings/:id",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    // Pega o id da url
                    var id = this.urlParams.id,
                        shipping = {};

                    // busca o shipping no banco
                    shipping = Shippings.findOne({ _id: id });

                    // se for encontrado retorna
                    if (shipping) {
                        return {
                            status: "success",
                            data: shipping
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Faixa de ceps não encontrada."
                        }
                    };
                }
            }, // end GET
            put: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        shipping = this.bodyParams;

                    // se for encontrado atualiza
                    if (Shippings.findOne({ _id: id })) {
                        Shippings.update(
                            {
                                _id: id
                            },
                            {
                                $set: shipping
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Shippings.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Faixa de ceps não encontrada."
                        }
                    };
                }
            }, // END PUT
            delete: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id;

                    // Verifica se o registro existe
                    if (Shippings.findOne({ _id: id })) {
                        // Remove o registro
                        Shippings.remove({ _id: id });

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Faixa de ceps excluída com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Faixa de ceps não encontrada."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Terms
    // =============================================================================

    // Maps to: /store/terms
    Api.addRoute(
        "terms",
        { authRequired: false },
        {
            // Insere novo Term
            post: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var term = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // Verifica se 'term' com aquele nome já existe naquela empresa
                    if (
                        Terms.findOne({ companyId: companyId, name: term.name })
                    ) {
                        return {
                            statusCode: 304,
                            body: {
                                status: "fail",
                                message:
                                    "Empresa já possui um termo com esse nome."
                            }
                        };
                    }

                    // faz a novo term receber o companyId
                    term.companyId = companyId;

                    var id = Terms.insert(term);

                    return {
                        status: "success",
                        data: Terms.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        fields = ["url"];

                    // gera a query de busca
                    var query = getQuery(params, fields, companyId);

                    var terms = Terms.find(query).fetch();

                    // se encontrar o termo do parametro, retorna
                    if (terms.length > 0 || !params.name) {
                        return {
                            status: "success",
                            data: terms
                        };
                    } else {
                        // se não, retorna erro
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message: "Não existe um termo com esse nome."
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

    // Maps to: /store/terms/:id
    Api.addRoute(
        "terms/:id",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    // Pega o id da url
                    var id = this.urlParams.id,
                        terms = {};

                    // busca o terms no banco
                    terms = Terms.findOne({ _id: id });

                    // se for encontrado retorna
                    if (terms) {
                        return {
                            status: "success",
                            data: terms
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Termos não encontrados."
                        }
                    };
                }
            }, // end GET
            put: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        terms = this.bodyParams;

                    // se for encontrado atualiza
                    if (Terms.findOne({ _id: id })) {
                        Terms.update(
                            {
                                _id: id
                            },
                            {
                                $set: terms
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Terms.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Termos não encontrados."
                        }
                    };
                }
            }, // END PUT
            delete: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id;

                    // Verifica se o registro existe
                    if (Terms.findOne({ _id: id })) {
                        // Remove o registro
                        Terms.remove({ _id: id });

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Termos excluídos com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Termos não encontrados."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Coupons
    // =============================================================================

    // Maps to: /store/coupons
    Api.addRoute(
        "coupons",
        { authRequired: false },
        {
            // Insere novo Coupon
            post: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var coupon = this.bodyParams;

                    // salva também a empresa
                    coupon.companyId = this.user.profile.company.companyId;

                    // gera um código para o cupom
                    if (!coupon.code) coupon.code = Random.id(5);

                    var id = Coupons.insert(coupon);

                    return {
                        status: "success",
                        data: Coupons.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        fields = ["code", "user.userId", "user.firstname"];

                    // gera a query de busca
                    var query = getQuery(params, fields, companyId);

                    // busca todos os cupons da empresa
                    var coupons = Coupons.find(query).fetch();

                    return {
                        status: "success",
                        data: coupons
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /store/coupons/:id
    Api.addRoute(
        "coupons/:id",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    // Pega o id da url
                    var param = this.urlParams.id,
                        coupon = {};

                    // trata o termo enviado, se for id ou código
                    coupon = Coupons.findOne({ _id: param });
                    if (!coupon) coupon = Coupons.findOne({ code: param });

                    // se for encontrado retorna
                    if (coupon) {
                        //se cupom já tiver sido utilizado, não retorna
                        if (
                            coupon.used >= coupon.limit ||
                            new Date() > coupon.expires
                        ) {
                            return {
                                statusCode: 403,
                                body: {
                                    status: "fail",
                                    message: "Cupom indisponível para uso."
                                }
                            };
                        }

                        // se não, retorna o cupom
                        return {
                            status: "success",
                            data: coupon
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cupom não encontrado."
                        }
                    };
                }
            }, // end GET
            put: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        coupon = this.bodyParams;

                    // se for encontrado atualiza
                    if (Coupons.findOne({ _id: id })) {
                        Coupons.update(
                            {
                                _id: id
                            },
                            {
                                $set: coupon
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Coupons.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cupom não encontrado."
                        }
                    };
                }
            }, // END PUT
            patch: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        coupon = this.bodyParams;

                    // se for encontrado atualiza
                    if (Coupons.findOne({ _id: id })) {
                        Coupons.update(
                            {
                                _id: id
                            },
                            {
                                $set: coupon
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Coupons.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cupom não encontrado."
                        }
                    };
                }
            },
            delete: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id;

                    // Verifica se o registro existe
                    if (Coupons.findOne({ _id: id })) {
                        // Remove o registro
                        Coupons.remove({ _id: id });

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Cupom excluído com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cupom não encontrado."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /store/coupons/:id/use
    Api.addRoute(
        "coupons/:id/use",
        { authRequired: false },
        {
            put: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var id = this.urlParams.id,
                        coupon = this.bodyParams;

                    // se for encontrado atualiza
                    if (Coupons.findOne({ _id: id })) {
                        Coupons.update(
                            {
                                _id: id
                            },
                            {
                                $set: { used: coupon.use || true }
                            }
                        );

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Coupons.findOne({ _id: id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Cupom não encontrado."
                        }
                    };
                }
            }, // END PUT
            options: function() {
                return {};
            }
        }
    );

    // Status
    // =============================================================================

    // Maps to: /store/status
    Api.addRoute(
        "status",
        { authRequired: false },
        {
            // Insere novo Status
            post: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var status = this.bodyParams,
                        companyId = this.user.profile.company.companyId;

                    // Verifica se 'term' com aquele nome já existe naquela empresa
                    if (Status.findOne({ companyId: companyId })) {
                        return {
                            statusCode: 304,
                            body: {
                                status: "fail",
                                message:
                                    "Empresa já possui um conjunto de status."
                            }
                        };
                    }

                    // faz a novo term receber o companyId
                    status.companyId = companyId;

                    var id = Status.insert(status);

                    return {
                        status: "success",
                        data: Status.findOne({ _id: id })
                    };
                }
            }, // end POST
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        fields = ["status.name"];

                    if (params.name) params["status"] = { name: params.name };

                    // gera a query de busca
                    var query = getQuery(params, fields, companyId);

                    var status = Status.find(query).fetch();

                    // se encontrar o termo do parametro, retorna
                    if (status.length > 0 || !params.name) {
                        return {
                            status: "success",
                            data: status
                        };
                    } else {
                        // se não, retorna erro
                        return {
                            statusCode: 404,
                            body: {
                                status: "fail",
                                message: "Não existe um status com esse nome."
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

    // Maps to: /store/status/:param
    Api.addRoute(
        "status/:param",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    // Pega o param da url
                    var param = this.urlParams.param,
                        status = {};

                    // busca o status no banco
                    status = Status.findOne({ _id: param });

                    // verifica se foi enviado o nome
                    if (!status)
                        status = Status.findOne({
                            status: { $elemMatch: { name: param } }
                        });

                    // se for encontrado retorna
                    if (status) {
                        return {
                            status: "success",
                            data: status
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Status não encontrados."
                        }
                    };
                }
            }, // end GET
            put: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var param = this.urlParams.param,
                        newStatus = this.bodyParams,
                        query = { _id: param };

                    // recebe o id da company
                    newStatus.companyId = this.user.profile.company.companyId;

                    // verifica se encontra pelo id
                    var status = Status.findOne(query);

                    // se não for encontrado, busca pelo nome
                    if (!status) {
                        query = { status: { $elemMatch: { name: param } } };
                        status = Status.findOne(query);
                    }

                    // se for encontrado atualiza
                    if (status) {
                        Status.update(query, {
                            $set: newStatus
                        });

                        // Retorna mensagem de sucesso
                        return {
                            status: "success",
                            data: Status.findOne({ _id: status._id })
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Status não encontrados."
                        }
                    };
                }
            }, // END PUT
            delete: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var param = this.urlParams.param,
                        query = { _id: param };

                    // verifica se encontra pelo id
                    var status = Status.findOne(query);

                    // se não for encontrado, busca pelo nome
                    if (!status) {
                        query = { status: { $elemMatch: { name: param } } };
                        status = Status.findOne(query);
                    }

                    // Verifica se o registro existe
                    if (status) {
                        // Remove o registro
                        Status.remove(query);

                        return {
                            statusCode: 204,
                            body: {
                                status: "success",
                                message: "Status excluídos com sucesso."
                            }
                        };
                    }

                    // Retorna um erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Status não encontrados."
                        }
                    };
                }
            }, // end DELETE
            options: function() {
                return {};
            }
        }
    );

    // Settings
    // =============================================================================

    // Maps to: /store/settings
    Api.addRoute(
        "settings",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    this.user = setUser(this);

                    settings = Settings.findOne({
                        companyId: this.user.profile.company.companyId
                    });

                    return {
                        status: "success",
                        data: settings || {}
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Sections
    // =============================================================================

    // Maps to: /store/sections
    Api.addRoute(
        "sections",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var params = this.queryParams,
                        companyId = this.user.profile.company.companyId,
                        fields = [
                            "name",
                            "url",
                            "subSections",
                            "subSections.name",
                            "subSections.url"
                        ];

                    // gera a query de busca
                    var query = getQuery(params, fields, companyId),
                        sections = Sections.find(query).fetch();

                    // se for encontrado retorna
                    if (sections) {
                        return {
                            status: "success",
                            data: sections
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Seção não encontrada."
                        }
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Maps to: /store/sections/:param
    Api.addRoute(
        "sections/:param",
        { authRequired: false },
        {
            get: {
                // Regras permitidas
                action: function() {
                    // seta o usuário logado
                    setUser(this);

                    var section = Sections.findOne({
                        _id: this.urlParams.param,
                        companyId: this.user.profile.company.companyId
                    });

                    // se for encontrado retorna
                    if (section) {
                        return {
                            status: "success",
                            data: section
                        };
                    }

                    // se não, erro
                    return {
                        statusCode: 404,
                        body: {
                            status: "fail",
                            message: "Seção não encontrada."
                        }
                    };
                }
            }, // end GET
            options: function() {
                return {};
            }
        }
    );

    // Functions

    //filtra por ativos dentro de arrays específicos
    function especificActive(registers, where) {
        registers.forEach(function(data) {
            data[where] = data[where].filter(function(singleData) {
                return singleData.active == 1;
            });
        });
        return registers;
    }

    //função que retorna uma query de acordo com os parâmtros passados
    function getQuery(params, fields, companyId, query) {
        if (!query) query = {};

        if (fields)
            // garante o _id por padrão
            fields.push("_id");

        if (companyId)
            // se enviar companyId, adiciona na query
            query["companyId"] = companyId;

        Object.keys(params).forEach(function(param) {
            if (fields.indexOf(param) > -1)
                query = fieldQuery(params[param], query, param);
        });
        return query; //retorna a query formatada
    }

    // função que configura o valor de um parâmetro
    function fieldQuery(value, query, param) {
        var values = [];
        if (value.indexOf(",") > -1) {
            values = value.split(",");
            query = queryOperators("$and", query, values, param);
        } else if (value.indexOf(";") > -1) {
            values = value.split(";");
            query = queryOperators("$or", query, values, param);
        } else {
            query[param] = regex(value);
        }
        return query;
    }

    //função que configura uma query $or ou $and
    function queryOperators(operator, query, values, param) {
        query[operator] = [];
        values.forEach(function(value) {
            var search = {};
            search[param] = regex(value);
            query[operator].push(search);
        });
        return query;
    }

    // adiciona active na query
    function setActive(query) {
        query.active = 1;
        return query;
    }

    function setUser(context) {
        context.userId = context.request.headers["x-user-id"];

        if (context.userId) context.user = Meteor.users.findOne(context.userId);

        return context.user;
    }

    //função para retirada dos %
    function regex(value) {
        return value.indexOf("%") > -1
            ? { $regex: value.replace(/%/g, "") }
            : value;
    }
}
