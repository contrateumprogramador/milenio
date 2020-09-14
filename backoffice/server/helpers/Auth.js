export const Auth = (roles) => {
    if (!Array.isArray(roles)) roles = [roles];

    if (!Roles.userIsInRole(Meteor.userId(), roles.concat("super-admin")))
        throw new Meteor.Error(403, "Sem permissão para executar esta ação.");

    return;
};
