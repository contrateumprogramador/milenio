Customizations = new Mongo.Collection('customizations');

Customizations.allow({
  insert: function(userId, customization) {
    return userId;
  },
  update: function(userId, customization, fields, modifier) {
    return userId;
  },
  remove: function(userId, customization) {
    return userId;
  }
});

Customizations.attachBehaviour('timestampable');

// hook para quando alterar customização, modificar também nos itens que possuem a customização
Customizations.after.update(function(userId, doc) {
    //encontra os itens que possuem a customização
    var itens = Items.find({
      customizations: { $elemMatch : { _id : doc._id } }
    }).fetch();

    //chama a função para atualizar os itens
    if(itens.length > 0)
      controla(0, itens, doc);

});

//controla a atualização dos itens
function controla(key, itens, doc){
  // percorre as customizações
  itens[key].customizations.forEach(function(customization, index) {
    //ao encontrar a modificada, remove a antiga e adiciona a nova
    if(customization._id == doc._id){
      itens[key].customizations.splice(index, 1);
      itens[key].customizations.push(doc);
    }
  });

  //atualiza o item
  Meteor.call('itemEdit', itens[key], function(err, r){
    //se ainda tiver mais itens, chama novamente
    if(key < itens.length-1)
      controla(++key, itens, doc);
  });
}
