module.exports = function(ngModule){
    ngModule.factory('itemCheckout', function(Loja, toast) {

        // Private API

        // Public API
        return {
            itemAdd: function(item, quant) {
              if(item.customizations)
                completeAdd(item, quant);
              else {
                Loja.Store.items(item._id).then(function(response){
                  var item = response.data.data,
                    checkoutItem = checkoutItemConfig(item);
                  completeAdd(checkoutItem, quant);
                });
              }
              return;
            }
        };

        function checkoutItemConfig(item){
          var installments = Loja.Store.itemInstallments(item || {});
          return {
            _id: item._id,
            customizations: {},
            name: item.name,
            name_nd: item.name_nd,
            options: item.options[0],
            picture: item.pictures[0] || "",
            url: item.url,
            installments: installments
          };
        }

        function completeAdd(checkoutItem, quant){
          Loja.Checkout.itemAdd(checkoutItem, quant);
          toast.message("Produto adicionado ao carrinho.", 2000);
        }
    });
};
