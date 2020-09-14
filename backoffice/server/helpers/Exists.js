export const Exists = (collection, query = {}) => {
    if (typeof collection != "object")
        throw new Meteor.Error(400, "Coleção incorreta.");

    var count = collection.find(query, { fields: { _id: 1 } }).count();

    if (!count) throw new Meteor.Error(404, "Não encontrado");

    return count;
};
