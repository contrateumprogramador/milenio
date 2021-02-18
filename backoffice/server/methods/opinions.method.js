'use strict';

import { Auth } from "../helpers/Auth";
import { List } from "../helpers/List";

if (Meteor.isServer) {
    Meteor.methods({
        "Opinions.list": function(query) {
            Auth("admin");

            query = { ...query };

            options = { };

            return List(Opinions, query, options);
        },
        "Opinions.toggle": function(opinionId, exibed) {
            Auth("admin");

            Opinions.update({ _id: opinionId }, { $set: { exibed } })

            return;
        }
    });
}
