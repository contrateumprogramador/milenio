export const List = (
    collection,
    query = {},
    options = { skip: 0, limit: 10 }
) => {
    if (typeof collection != "object")
        throw new Meteor.Error(400, "Coleção incorreta.");

    var items = collection.find(query, options).fetch();

    return {
        items,
        total: collection.find(query).count()
    };
};
