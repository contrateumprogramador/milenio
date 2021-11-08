RssFeed.publish("mileniomoveis", function() {
    var self = this;

    self.xmlns('xmlns:g="http://base.google.com/ns/1.0"');

    self.setValue("title", "Milênio Móveis");
    self.setValue(
        "description",
        "Móveis de Alto Padrão. Linha Completa para Área Interna e Externa."
    );
    self.setValue("link", "https://www.mileniomoveis.com.br/");
    self.setValue("lastBuildDate", new Date());
    self.setValue("pubDate", new Date());
    self.setValue("ttl", 1);

    var items = Items.find({
        companyId: "T8b7jMLWibW2sjAo6",
        $or: [{ "googleShopping.active": 1 }, { "googleShopping.active": true }]
    }).fetch();

    items.forEach((item) => {
        try {
            var data = JSON.parse(item.googleShopping.data);
            self.addItem({
                title: item.name,
                link:
                    "https://www.mileniomoveis.com.br/movel/" +
                    item.url + 
                    "/" +
                    item._id, 
                description: self.cdata(
                    data.description ? data.description.substr(0, 400) : ""
                ),
                "g:id": item._id,
                "g:image_link": item.pictures[0],
                "g:condition": "new",
                "g:availability": getAvailability(item),
                "g:brand": data["g:brand"],
                "g:mpn": item._id,
                "g:google_product_category": data["g:google_product_category"],
                "g:product_type": data["g:product_type"],
                "g:price":
                    (
                        item.options[0].salesPrice || item.options[0].price
                    ).toFixed(2) + " BRL"
            });
        } catch (e) {
            console.log(item);
        }
    });

    /**
     * Retorna disponibilidade do item
     * @param {object} item
     */
    function getAvailability(item) {
        switch (item.stock) {
            case -1:
                return "out of stock";
            case 1:
                return "in stock";
            default:
                return "preorder";
        }
    }
});
