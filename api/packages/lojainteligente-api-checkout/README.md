# Checkout : LojaInteligente #

**Endpoint:** `/checkout`

--------------------

## Ações ##
##**POST /start**##
Deve ser chamado quando cliente inicia o processo de checkout (ao clicar em "concluir compra")

**Permissões:** `'super-admin', 'admin', 'manager', 'sales', 'api', 'customer'`

**Body Request**

```
#!json
{
    cart: {
        discount: 0,
        installmentsMax: 1,
        items: {},
        itemsCount: 0,
        itemsTotal: 0,
        shippingPrice: 0,
        total: 0
    },
    customer: {},
    events: [],
    shipping: {},
    meta: {
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

```

**Response**

```
#!json

{
    cart: {
        discount: 0,
        installmentsMax: 1,
        items: {},
        itemsCount: 0,
        itemsTotal: 0,
        shippingPrice: 0,
        total: 0
    },
    customer: {},
    events: [],
    shipping: {},
    meta: {
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

```
**Status Code**

* `401` Não autorizado.
* `404` Checkout não encontrado (apenas se _id for passado)










-----------

##**POST /:checkoutId/:eventName**##

Registra um `event` do `user` e salva alterações no `checkout` se necessário.

**Permissões:** `'super-admin', 'admin', 'manager', 'sales', 'api', 'customer'`

###Eventos###
* `cart_start` quando o primeiro item é adicionado ao carrinho
* `checkout_start` quando cliente inicia o processo de checkout (ao clicar em "concluir compra")
* `customer_identify` quando o cliente informa seu e-mail, pode ocorrer mesmo antes do `cart_start`
* `item_add` quando um item é adicinado ao carrinho
* `item_remove` quando um item é removido do carrinho
* `item_quant_change` quando a quantidade de um item é alterada
* `payment_attempt` quando há uma tentativa de pagamento (via cartão de crédito)
* `payment_deny` quando o pagamento é negado (via cartão de crédito)
* `payment_complete` quando o pagamento é confirmado (via cartão de crédito)
* `payment_capture` quando um pagamento é capturado <==
* `order_cancel` quando um pagamento é cancelado <==
* `shipping_inform` quando o cliente informou seu endereço completo
* `ticket_genereate` quando um boleto é gerado
* `ticket_access` quando um boleto é acessado/visualizado
* `ticket_pay` quando um boleto é pago <==

--------------------

`cart_start`
*Este evento atualmente só é disparado no front-end.*

-------

`checkout_start`
Disparado quando cliente inicia o processo de checkout (ao clicar em "concluir compra").

**Body Request**

```
#!json
{
    cart: {
        discount: 0,
        installmentsMax: 1,
        items: {},
        itemsCount: 0,
        itemsTotal: 0,
        shippingPrice: 0,
        total: 0
    },
    customer: {},
    events: [],
    shipping: {},
    meta: {
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

```

**Response**

```
#!json

{
    cart: {
        discount: 0,
        installmentsMax: 1,
        items: {},
        itemsCount: 0,
        itemsTotal: 0,
        shippingPrice: 0,
        total: 0
    },
    customer: {},
    events: [],
    shipping: {},
    meta: {
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

```
**Status Code**

* `401` Não autorizado.