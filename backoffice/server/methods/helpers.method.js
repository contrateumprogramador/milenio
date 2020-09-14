'use strict';

if (Meteor.isServer) {
    Meteor.methods({
        cleanData: function(data, model) {
            check(data, Object);

            if (model)
                check(model, String);

            if (model && data._id)
                data[model + 'Id'] = data._id;

            delete data._id;
            delete data.createdAt;
            delete data.createdBy;
            delete data.updatedAt;
            delete data.updatedBy;

            switch(model) {
                case 'customer':
                    if (data.companies)
                        delete data.companies;
                    break;
            }

            return data;
        }
    });
}
