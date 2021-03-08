import _ from "lodash";

Meteor.methods({
    "Adm.itemsToShipping": function() {
        try {
            const items = Items.find({ stock: { $ne: -1 } }, { fields: { stock: 1, name: 1 } }).map((item) => {
                console.log("Item " + item.name +" adicionado com sucesso")
                return item._id                
            })

            Items.update({ _id: { $in: items } }, { $set: { stock: 0 } }, { multi: true })
            console.log("Itens atualizados com sucesso")
        } catch (ex) {
            console.log(ex)
            return ex
        }

        return true
    },
    "Adm.shippingTimeChange": function() {
        try {
            Items.find({}, { fields: { attributes: 1, name: 1 } }).forEach(function(item) {
                const especifications = _.get(item, "attributes[1].content");
                if(especifications && especifications.indexOf("45 dias") > -1) {
                    item.attributes[1].content = especifications.replace("45 dias", "50 dias úteis")
                    Items.update({ _id: item._id }, { $set: { attributes: item.attributes } });
                    console.log(item.name + " atualizou com sucesso");
                } else {
                    console.log(item.name + " Escapou");
                }
            });

            return true;
        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
});