# Emails : LojaInteligente #

**Endpoint:** `/emails`

--------------------

## Ações ##
##**POST /contact**##

Envia um e-mail de contato para a `Loja Inteligente`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`, `customer`

**Request Body**

```
#!json

{
	"name": "Bruno Marra de Melo", 
	"phone": "(37) 99802-1938",
	"email": "brunomarram@hotmail.com", 
	"message": "Teste maluco"
}
```

**Response**

```
#!json

{
    "status": "success",
    "data": "Mensagem enviada com sucesso."
}
```

**Status Code**

* Referência de códigos Sparkpost:
`https://www.sparkpost.com/docs/tech-resources/extended-error-codes/`

--------------------

## Ações ##
##**POST /auth/:userId/welcome**##

Envia um e-mail de boas-vindas para o `user`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
    "status": "success",
    "data": "Mensagem enviada com sucesso."
}
```

**Status Code**

* Referência de códigos Sparkpost:
`https://www.sparkpost.com/docs/tech-resources/extended-error-codes/`

--------------------

##**POST /auth/:userId/new_password**##

Gera uma nova senha de 8 caracteres aleatórios e envia a nova senha para o `user`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
    "status": "success",
    "data": "Mensagem enviada com sucesso."
}
```

**Status Code**

* Referência de códigos Sparkpost:
`https://www.sparkpost.com/docs/tech-resources/extended-error-codes/`

--------------------

## Ações ##
##**POST /orders/:orderId/status**##

Informa um `customer` sobre alterações me seu `order`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
    "status": "success",
    "data": "Mensagem enviada com sucesso."
}
```

**Status Code**

* Referência de códigos Sparkpost:
`https://www.sparkpost.com/docs/tech-resources/extended-error-codes/`

--------------------

##**POST /orders/:orderId/cancel**##

Informa um `customer` sobre cancelamento de seu `order`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
    "status": "success",
    "data": "Mensagem enviada com sucesso."
}
```

**Status Code**

* Referência de códigos Sparkpost:
`https://www.sparkpost.com/docs/tech-resources/extended-error-codes/`