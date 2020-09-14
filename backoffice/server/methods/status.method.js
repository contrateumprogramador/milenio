"use strict";

if (Meteor.isServer) {
    Meteor.methods({
        statusAdd: function(status) {
            check(status, Object);

            // variável-recipiente
            var newStatus = {};

            if (!Roles.userIsInRole(Meteor.userId(), ["admin", "manager"]))
                throw new Meteor.Error(403, "Permissão negada.");

            // pega o companyId
            var id = Meteor.user().profile.company.companyId;

            // verifica se empresa já possui lista de status
            var company = Status.findOne({ companyId: id });

            // se não, insere um novo registro
            if (!company) {
                newStatus.status = [status];
                newStatus.companyId = id;
                Status.insert(newStatus);
            } else {
                // se já possui, insere só o novo status
                Status.update(
                    {
                        companyId: id
                    },
                    {
                        $push: { status: status }
                    }
                );
            }

            return;
        },
        statusList: function() {
            if (
                !Roles.userIsInRole(Meteor.userId(), [
                    "admin",
                    "manager",
                    "salesman",
                    "maintenance",
                    "expedition",
                    "affiliate"
                ])
            )
                throw new Meteor.Error(403, "Permissão negada.");

            var status = Status.find({
                companyId: Meteor.user().profile.company.companyId
            }).fetch();

            return status;
        },
        statusRemove: function(status) {
            if (!Roles.userIsInRole(Meteor.userId(), ["admin", "manager"]))
                throw new Meteor.Error(403, "Permissão negada.");

            var companyId = Meteor.user().profile.company.companyId;

            var oldStatus = {
                name: status.name,
                message: status.message
            };

            Status.update(
                {
                    companyId: companyId
                },
                {
                    $pull: { status: oldStatus }
                }
            );

            return;
        },
        statusEdit: function(status, key) {
            if (!Roles.userIsInRole(Meteor.userId(), ["admin", "manager"]))
                throw new Meteor.Error(403, "Permissão negada.");

            var companyId = Meteor.user().profile.company.companyId;

            var oldStatus = Status.findOne({ companyId: companyId });
            oldStatus = oldStatus.status[key];

            Status.update(
                {
                    companyId: companyId
                },
                {
                    $pull: { status: oldStatus }
                }
            );

            Status.update(
                {
                    companyId: companyId
                },
                {
                    $push: { status }
                }
            );

            return;
        },
        statusReorder: function(status) {
            if (!Roles.userIsInRole(Meteor.userId(), ["admin", "manager"]))
                throw new Meteor.Error(403, "Permissão negada.");

            var oldStatus = Status.findOne({
                companyId: Meteor.user().profile.company.companyId
            });

            if (!oldStatus)
                throw new Meteor.Error(403, "Status não encontrado.");

            var newStatus = status.status;

            Status.update(
                {
                    companyId: oldStatus.companyId
                },
                {
                    $set: { status: newStatus }
                }
            );

            return;
        }
    });
}
