"use strict";

if (Meteor.isServer) {
    Meteor.methods({
        itemAdd: function(item) {
            check(item, Object);

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            var company = Companies.findOne({
                _id: Meteor.user().profile.company.companyId
            });

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            item = configure(item); //aplica algumas configurações no objeto
            item.companyId = company._id;

            Items.insert(item);

            return;
        },
        itemGet: function(id, showItem) {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition",
                    "salesman",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            var item = Items.findOne({ _id: id });

            if (!item) throw new Meteor.Error(403, "Item não encontrado.");

            if (showItem) {
                if (item.customizations) {
                    item.customizations = findCustomizations(
                        item.customizations
                    );
                }

                if (item.related) {
                    item.related = findRelated(item.related);
                }
            }

            return item;
        },
        getAllItems: function() {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition",
                    "salesman"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            var query = {
                fields: {
                    name: 1,
                    name_nd: 1,
                    pictures: 1,
                    active: 1,
                    tags: 1,
                    createdAt: 1
                },
                sort: {
                    createdAt: -1
                }
            };

            var retorno = {
                items: Items.find(
                    { companyId: Meteor.user().profile.company.companyId },
                    query
                ).fetch(),
                total: Items.find({
                    companyId: Meteor.user().profile.company.companyId
                }).count()
            };

            return retorno;
        },
        itemsList: function(pagination) {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition",
                    "salesman"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            var query = {
                fields: {
                    name: 1,
                    name_nd: 1,
                    pictures: 1,
                    active: 1,
                    tags: 1,
                    createdAt: 1
                },
                sort: {
                    createdAt: -1
                },
                limit: pagination.limit,
                skip: pagination.skip
            };

            var retorno = {
                items: Items.find(
                    { companyId: Meteor.user().profile.company.companyId },
                    query
                ).fetch(),
                total: Items.find({
                    companyId: Meteor.user().profile.company.companyId
                }).count()
            };

            return retorno;
        },
        searchItems: function(searchText) {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition",
                    "salesman",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            return Items.find({
                companyId: Meteor.user().profile.company.companyId,
                name_nd: regex(searchText)
            }).fetch();
        },
        itemsCount: function() {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            return Items.find({
                companyId: Meteor.user().profile.company.companyId
            }).count();
        },
        itemRemove: function(id) {
            check(id, String);

            if (!Roles.userIsInRole(Meteor.userId(), ["admin", "expedition"]))
                throw new Meteor.Error(403, "Permissão negada.");

            Items.remove({ _id: id });

            return;
        },
        itemEdit: function(item) {
            check(item, Object);

            var id = item._id,
                update = {};

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            var company = Companies.findOne({
                _id: Meteor.user().profile.company.companyId
            });

            if (!company)
                throw new Meteor.Error(404, "Empresa não encontrada.");

            item = configure(item); //aplica algumas configurações no objeto
            item.companyId = company._id;

            if (!item.installments || item.installments.min == 0) {
                delete item.installments;
                update["$unset"] = { installments: "" };
            }
            update["$set"] = item;

            Items.update(
                {
                    _id: id
                },
                update
            );

            return;
        },
        itemOcult: function(id, ocult) {
            check(id, String);

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(
                    403,
                    "Você não tem permissão para ocultar itens."
                );

            var item = Items.findOne({ _id: id });

            if (!item) throw new Meteor.Error(404, "Item não encontrado.");

            Items.update(
                {
                    _id: id
                },
                {
                    $set: { active: !ocult }
                }
            );
        },
        customizationAdd: function(data) {
            check(data, Object);

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            //verifica se o usuário logado é de alguma empresa
            var company = Companies.findOne({
                _id: Meteor.user().profile.company.companyId
            });

            if (!company)
                throw new Meteor.Error(506, "Empresa não encontrada.");

            //salva o id da empresa que está criando a customização
            data.companyId = company._id;

            return Customizations.insert(data);
        },
        customizationEdit: function(data) {
            check(data, Object);

            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            //verifica se o usuário logado é de alguma empresa
            var company = Companies.findOne({
                _id: Meteor.user().profile.company.companyId
            });

            if (!company)
                throw new Meteor.Error(506, "Empresa não encontrada.");

            //salva o id da empresa que está editando a customização
            data.companyId = company._id;

            Customizations.update(
                {
                    _id: data._id
                },
                {
                    $set: data
                }
            );

            return;
        },
        listCustomizations: function() {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            return Customizations.find({
                companyId: Meteor.user().profile.company.companyId
            }).fetch();
        },
        customizationRemove: function(customizationId) {
            check(customizationId, String);

            if (!Roles.userIsInRole(Meteor.userId(), ["admin", "expedition"]))
                throw new Meteor.Error(403, "Sem permissão.");

            //checa se ID existe
            if (!Customizations.findOne({ _id: customizationId }))
                throw new Meteor.Error(506, "Customização não encontrada.");

            Customizations.remove({ _id: customizationId });

            return;
        },
        itemCustomizations: function(ids) {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "maintenance",
                    "expedition",
                    "salesman",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Sem permissão.");

            return Customizations.find({ _id: { $in: ids || [] } }).fetch();
        }
    });

    // configura as tags no formato correto
    function configure(item) {
        // se tiver googleShopping, transforma objeto em string
        if (item.googleShopping && item.googleShopping.active)
            item.googleShopping.data = JSON.stringify(
                item.googleShopping.data
            );

        var newTags = [];
        if (item.tags) {
            item.tags.forEach(function(tag) {
                newTags.push({
                    name: tag.name,
                    url: tag.url,
                    tagsGroup: tag.tagsGroup
                });
            });
        }
        item.tags = newTags;
        item = configureCustomizations(item);
        return item;
    }

    //faz o mesmo que as tags, mas com campos diferentes
    function configureCustomizations(item) {
        var customizations = [];
        if (item.customizations) {
            item.customizations.forEach(function(customization) {
                customizations.push(customization._id);
            });
        }
        item.customizations = customizations;
        item = configureRelated(item);
        return item;
    }

    function configureRelated(item) {
        var related = [];
        if (item.related) {
            item.related.forEach(function(related_item) {
                if (related_item) related.push(related_item._id);
            });
        }
        item.related = related;
        return item;
    }

    function findCustomizations(ids) {
        var customizations = [];

        ids.forEach(function(customization) {
            customization = Customizations.findOne(customization);
            if (customization) customizations.push(customization);
        });

        return customizations;
    }

    function findRelated(ids) {
        var related = [];

        ids.forEach(function(item) {
            item = Items.findOne(item, {
                fields: {
                    pictures: 1,
                    name: 1
                }
            });

            if (item) related.push(item);
        });

        return related;
    }

    //função para retirada dos %
    function regex(value) {
        return { $regex: new RegExp(value, "i") };
    }
}
