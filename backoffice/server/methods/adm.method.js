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
    }
});