# Customers : LojaInteligente #

**Endpoint:** `/customers`

--------------------

## Ações ##
##**POST /customers**##

Cria `customer`

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `customer`, `api`

**Request Body**

```
#!json

{
  "name": "Diego Guimarães",
  "email": "diego@cupideias.com",
  "document": "06249938680",
  "phone": "3196975408"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "miQpLnfivbQjBnLkt",
		"name": "Diego Guimarães",
		"email": "diego@cupideias.com",
		"document": "06249938680",
		"phone": "3196975408",
		"companies": [
			"mHEBkZPHon6cpirTD"
		],
		"createdAt": "2017-06-03T01:22:15.907Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `304` Empresa possui cliente com mesmo email.

-----------------

##**GET /customers**##

Retorna `customers`

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `customer`, `api`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães",
			"email": "diego@cupideias.com",
			"document": "06249938680",
			"phone": "3196975408",
			"companies": [
				"mHEBkZPHon6cpirTD"
			],
			"createdAt": "2017-06-03T01:22:15.907Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.

-----------------

##**GET /customers/:id || /customers/:email**##

Busca um `customer` por id ou por email

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "miQpLnfivbQjBnLkt",
		"name": "Diego Guimarães",
		"email": "diego@cupideias.com",
		"document": "06249938680",
		"phone": "3196975408",
		"companies": [
			"mHEBkZPHon6cpirTD"
		],
		"createdAt": "2017-06-03T01:22:15.907Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Cliente não encontrado.

-----------------

##**PUT /customers/:id || /customers/:email**##

Atualiza um `customer` pelo id ou pelo email

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Request Body**

```
#!json

{
  "name": "Diego Guimarães Ferreira",
  "email": "novopeloemail@cupideias.com",
  "document": "06249938680",
  "phone": "3196975408"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "6Ks5AW44KxvEqWPE8",
		"name": "Diego Guimarães Ferreira",
		"email": "novopeloemail@cupideias.com",
		"document": "06249938680",
		"phone": "3196975408",
		"companies": [
			"mHEBkZPHon6cpirTD"
		],
		"createdAt": "2017-06-03T00:23:30.185Z",
		"createdBy": "0",
		"updatedAt": "2017-06-03T01:02:52.599Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Cliente não encontrado.

-----------------

##**PATCH /customers/:id || /customers/:email**##

Adiciona uma `company` a um `customer` pelo id ou pelo email

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Request Body**

```
#!json

{
  "company": "mHEBkZPHon6cpirTD"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "6Ks5AW44KxvEqWPE8",
		"name": "Diego Guimarães Ferreira",
		"email": "novopeloemail@cupideias.com",
		"document": "06249938680",
		"phone": "3196975408",
		"companies": [
			"j23h42jl32kj4kj23",
			"mHEBkZPHon6cpirTD"
		],
		"createdAt": "2017-06-03T00:23:30.185Z",
		"createdBy": "0",
		"updatedAt": "2017-06-03T01:12:32.892Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Cliente não encontrado.

-----------------

##**DELETE /customers/:id || /customers/:email**##

Remove um `customer` pelo id ou pelo email

**Permissões:** `super-admin`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Cliente excluído com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Cliente não encontrado.

--------------------

##**GET /customers/me**##

Busca os dados do `customer` logado

**Permissões:** `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "miQpLnfivbQjBnLkt",
		"name": "Diego Guimarães",
		"email": "diego@cupideias.com",
		"document": "06249938680",
		"phone": "3196975408",
		"companies": [
			"mHEBkZPHon6cpirTD"
		],
		"createdAt": "2017-06-03T01:22:15.907Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Cliente não encontrado.

-----------------

##**PUT /customers/me**##

Atualiza os dados do `customer` logado

**Permissões:** `customer`

**Request Body**

```
#!json

{
  "name": "Diego Guimarães Ferreira",
  "email": "novopeloemail@cupideias.com",
  "document": "06249938680",
  "phone": "3196975408"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "6Ks5AW44KxvEqWPE8",
		"name": "Diego Guimarães Ferreira",
		"email": "novopeloemail@cupideias.com",
		"document": "06249938680",
		"phone": "3196975408",
		"companies": [
			"mHEBkZPHon6cpirTD"
		],
		"createdAt": "2017-06-03T00:23:30.185Z",
		"createdBy": "0",
		"updatedAt": "2017-06-03T01:02:52.599Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Cliente não encontrado.

-----------------

##**PATCH /customers/me**##

Adiciona uma empresa nas companies do `customer` logado

**Permissões:** `customer`

**Request Body**

```
#!json

{
  "company": "mHEBkZPHon6cpirTD"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "6Ks5AW44KxvEqWPE8",
		"name": "Diego Guimarães Ferreira",
		"email": "novopeloemail@cupideias.com",
		"document": "06249938680",
		"phone": "3196975408",
		"companies": [
			"j23h42jl32kj4kj23",
			"mHEBkZPHon6cpirTD"
		],
		"createdAt": "2017-06-03T00:23:30.185Z",
		"createdBy": "0",
		"updatedAt": "2017-06-03T01:12:32.892Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Cliente não encontrado.

-----------------

**Endpoint:** `/:customerId/addresses`

## Ações ##
##**POST /:customerId/addresses**##

Cria `address` para o `customer`

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Request Body**

```
#!json

{
	"zip": "30330050",
	"address": "Rua Major Lopes",
	"district": "São Pedro",
	"city": "Belo Horizonte",
	"state": "MG",
	"number": "383",
	"complement": "Ap. 307"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "mKaewY2AgEevMpM4f",
		"zip": "30330050",
		"address": "Rua Major Lopes",
		"district": "São Pedro",
		"city": "Belo Horizonte",
		"state": "MG",
		"number": "383",
		"complement": "Ap. 307",
		"customerId": "miQpLnfivbQjBnLkt",
		"createdAt": "2017-06-07T01:32:22.464Z",
		"createdBy": "0"
	}
}
```

-----------------

##**GET /:customerId/addresses**##

Retorna `addresses` de um `customer`

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Filtro:** `zipcode=30330050`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "mKaewY2AgEevMpM4f",
			"zip": "30330050",
			"address": "Rua Major Lopes",
			"district": "São Pedro",
			"city": "Belo Horizonte",
			"state": "MG",
			"number": "383",
			"complement": "Ap. 307",
			"customerId": "miQpLnfivbQjBnLkt",
			"createdAt": "2017-06-07T01:32:22.464Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Endereço não encontrado.

-----------------

##**GET /:customerId/addresses/:id**##

Busca um `address` por id

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "dLz3N44C86Bbp4Q8T",
		"zip": "30330050",
		"address": "Rua Major Lopes",
		"district": "São Pedro",
		"city": "Belo Horizonte",
		"state": "MG",
		"number": "383",
		"complement": "Ap. 307",
		"customerId": "miQpLnfivbQjBnLkt",
		"createdAt": "2017-06-07T01:05:52.074Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Endereço não encontrado.

-----------------

##**PUT /:customerId/addresses/:id**##

Atualiza um `address` pelo id

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Request Body**

```
#!json

{
	"zip": "30330050",
	"address": "Nova Rua",
	"district": "Novo Bairro",
	"city": "Belo Horizonte",
	"state": "MG",
	"number": "383",
	"complement": "Ap. 307"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "dLz3N44C86Bbp4Q8T",
		"zip": "30330050",
		"address": "Nova Rua",
		"district": "Novo Bairro",
		"city": "Belo Horizonte",
		"state": "MG",
		"number": "383",
		"complement": "Ap. 307",
		"customerId": "miQpLnfivbQjBnLkt",
		"createdAt": "2017-06-07T01:05:52.074Z",
		"createdBy": "0",
		"updatedAt": "2017-06-07T01:29:52.816Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Endereço não encontrado.

-----------------

##**DELETE /:customerId/addresses/:id**##

Remove um `address` pelo id

**Permissões:** `super-admin`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Endereço excluído com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Endereço não encontrado.

-----------------

##**POST /:customerId/addresses/:id/confirm**##

Confirma um `address` pelo id

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "mKaewY2AgEevMpM4f",
		"zip": "30330050",
		"address": "Rua Major Lopes",
		"district": "São Pedro",
		"city": "Belo Horizonte",
		"state": "MG",
		"number": "383",
		"complement": "Ap. 307",
		"customerId": "miQpLnfivbQjBnLkt",
		"createdAt": "2017-06-07T01:32:22.464Z",
		"createdBy": "0",
		"confirmed": true,
		"updatedAt": "2017-06-07T01:39:26.140Z",
		"updatedBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Endereço não encontrado.

--------------------

**Endpoint:** `/me/addresses`

## Ações ##
##**POST /me/addresses**##

Cria `address` para o `customer`

**Permissões:** `customer`

**Request Body**

```
#!json

{
	"zip": "30330050",
	"address": "Rua Major Lopes",
	"district": "São Pedro",
	"city": "Belo Horizonte",
	"state": "MG",
	"number": "383",
	"complement": "Ap. 307"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "mKaewY2AgEevMpM4f",
		"zip": "30330050",
		"address": "Rua Major Lopes",
		"district": "São Pedro",
		"city": "Belo Horizonte",
		"state": "MG",
		"number": "383",
		"complement": "Ap. 307",
		"customerId": "miQpLnfivbQjBnLkt",
		"createdAt": "2017-06-07T01:32:22.464Z",
		"createdBy": "0"
	}
}
```

-----------------

##**GET /me/addresses**##

Retorna `addresses` de um `customer`

**Permissões:** `customer`

**Filtro:** `zipcode=30330050`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "mKaewY2AgEevMpM4f",
			"zip": "30330050",
			"address": "Rua Major Lopes",
			"district": "São Pedro",
			"city": "Belo Horizonte",
			"state": "MG",
			"number": "383",
			"complement": "Ap. 307",
			"customerId": "miQpLnfivbQjBnLkt",
			"createdAt": "2017-06-07T01:32:22.464Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Endereço não encontrado.

-----------------

##**GET /me/addresses/:id**##

Busca um `address` por id

**Permissões:** `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "dLz3N44C86Bbp4Q8T",
		"zip": "30330050",
		"address": "Rua Major Lopes",
		"district": "São Pedro",
		"city": "Belo Horizonte",
		"state": "MG",
		"number": "383",
		"complement": "Ap. 307",
		"customerId": "miQpLnfivbQjBnLkt",
		"createdAt": "2017-06-07T01:05:52.074Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Endereço não encontrado.

-----------------

##**PUT /me/addresses/:id**##

Atualiza um `address` pelo id

**Permissões:** `customer`

**Request Body**

```
#!json

{
	"zip": "30330050",
	"address": "Nova Rua",
	"district": "Novo Bairro",
	"city": "Belo Horizonte",
	"state": "MG",
	"number": "383",
	"complement": "Ap. 307"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "dLz3N44C86Bbp4Q8T",
		"zip": "30330050",
		"address": "Nova Rua",
		"district": "Novo Bairro",
		"city": "Belo Horizonte",
		"state": "MG",
		"number": "383",
		"complement": "Ap. 307",
		"customerId": "miQpLnfivbQjBnLkt",
		"createdAt": "2017-06-07T01:05:52.074Z",
		"createdBy": "0",
		"updatedAt": "2017-06-07T01:29:52.816Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Endereço não encontrado.

-----------------

##**POST /me/addresses/:id/confirm**##

Confirma um `address` pelo id

**Permissões:** `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "mKaewY2AgEevMpM4f",
		"zip": "30330050",
		"address": "Rua Major Lopes",
		"district": "São Pedro",
		"city": "Belo Horizonte",
		"state": "MG",
		"number": "383",
		"complement": "Ap. 307",
		"customerId": "miQpLnfivbQjBnLkt",
		"createdAt": "2017-06-07T01:32:22.464Z",
		"createdBy": "0",
		"confirmed": true,
		"updatedAt": "2017-06-07T01:39:26.140Z",
		"updatedBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Endereço não encontrado.

-----------------

**Endpoint:** `/:customerId/orders`

## Ações ##
##**POST /:customerId/orders**##

Cria `order` para o `customer`

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Request Body**

```
#!json

{
	"cart": {},
	"paymentInfo": {}
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QPFyPT7qNLtpXm5o7",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [],
		"createdAt": "2017-06-14T22:49:25.754Z",
		"createdBy": "0"
	}
}
```

-----------------

##**GET /:customerId/addresses**##

Retorna `orders` de um `customer`

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "QPFyPT7qNLtpXm5o7",
			"cart": {},
			"paymentInfo": {},
			"company": {
				"companyId": "mHEBkZPHon6cpirTD",
				"name": "LojaInteligente"
			},
			"customer": {
				"customerId": "miQpLnfivbQjBnLkt",
				"name": "Diego Guimarães"
			},
			"status": [],
			"createdAt": "2017-06-14T22:49:25.754Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.

-----------------

##**GET /:customerId/orders/:id**##

Busca um `order` por id

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QPFyPT7qNLtpXm5o7",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [],
		"createdAt": "2017-06-14T22:49:25.754Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

-----------------

##**PUT /:customerId/orders/:id**##

Atualiza um `order` pelo id

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Request Body**

```
#!json

{	
  	"cart": {},
	"paymentInfo": {},
	"status": [{
        "name": "Pedido Realizado",
        "message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato."
    }]
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "Ntsvb8yaGp2SJT3xP",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [
			{
				"name": "Pedido Realizado",
				"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato.",
				"addededAt": "2017-06-15T11:43:10.686Z"
			}
		],
		"createdAt": "2017-06-14T22:41:40.163Z",
		"createdBy": "0",
		"updatedAt": "2017-06-15T11:43:17.291Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

-----------------

##**PATCH /:customerId/orders/:id**##

Adiciona um `status` a um `order` pelo id

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Request Body**

```
#!json

{
    "name": "Pedido Realizado",
    "message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato."
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QPFyPT7qNLtpXm5o7",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [
			{
				"name": "Pedido Realizado",
				"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato.",
				"addededAt": "2017-06-15T11:56:45.997Z"
			}
		],
		"createdAt": "2017-06-14T22:49:25.754Z",
		"createdBy": "0",
		"updatedAt": "2017-06-15T11:56:46.002Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

-----------------

##**DELETE /:customerId/orders/:id**##

Remove um `order` pelo id

**Permissões:** `super-admin`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Pedido excluído com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

-----------------

##**PUT /:customerId/addresses/:id/cancel**##

Cancela um `order` pelo id

**Permissões:** `super-admin`, `admin`, `manager`, `sales`, `financial`, `api`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QPFyPT7qNLtpXm5o7",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [
			{
				"name": "Pedido Realizado",
				"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato.",
				"addededAt": "2017-06-15T11:56:45.997Z"
			}
		],
		"createdAt": "2017-06-14T22:49:25.754Z",
		"createdBy": "0",
		"updatedAt": "2017-06-15T12:02:57.304Z",
		"updatedBy": "0",
		"canceled": true
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

--------------------

**Endpoint:** `/me/orders`

## Ações ##
##**POST /me/orders**##

Cria `order` para o `customer`

**Permissões:** `customer`

**Request Body**

```
#!json

{
	"cart": {},
	"paymentInfo": {}
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QPFyPT7qNLtpXm5o7",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [],
		"createdAt": "2017-06-14T22:49:25.754Z",
		"createdBy": "0"
	}
}
```

-----------------

##**GET /me/addresses**##

Retorna `orders` de um `customer`

**Permissões:** `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "QPFyPT7qNLtpXm5o7",
			"cart": {},
			"paymentInfo": {},
			"company": {
				"companyId": "mHEBkZPHon6cpirTD",
				"name": "LojaInteligente"
			},
			"customer": {
				"customerId": "miQpLnfivbQjBnLkt",
				"name": "Diego Guimarães"
			},
			"status": [],
			"createdAt": "2017-06-14T22:49:25.754Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

-----------------

##**GET /me/orders/:id**##

Busca um `order` por id

**Permissões:** `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QPFyPT7qNLtpXm5o7",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [],
		"createdAt": "2017-06-14T22:49:25.754Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

-----------------

##**PUT /me/orders/:id**##

Atualiza um `order` pelo id

**Permissões:** `customer`

**Request Body**

```
#!json

{	
  "cart": {},
	"paymentInfo": {},
	"status": [{
        "name": "Pedido Realizado",
        "message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato."
    }]
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "Ntsvb8yaGp2SJT3xP",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [
			{
				"name": "Pedido Realizado",
				"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato.",
				"addededAt": "2017-06-15T11:43:10.686Z"
			}
		],
		"createdAt": "2017-06-14T22:41:40.163Z",
		"createdBy": "0",
		"updatedAt": "2017-06-15T11:43:17.291Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

-----------------

##**PATCH /me/orders/:id**##

Adiciona um `status` a um `order` do `customer`

**Permissões:** `customer`

**Request Body**

```
#!json

{
    "name": "Pedido Realizado",
    "message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato."
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QPFyPT7qNLtpXm5o7",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [
			{
				"name": "Pedido Realizado",
				"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato.",
				"addededAt": "2017-06-15T11:56:45.997Z"
			}
		],
		"createdAt": "2017-06-14T22:49:25.754Z",
		"createdBy": "0",
		"updatedAt": "2017-06-15T11:56:46.002Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

-----------------

##**GET /me/orders/last**##

Pega o último pedido de um customer logado

**Permissões:** `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "iDpZvpqGKRCosKhXJ",
		"cart": {
			"discount": 0,
			"installmentsMax": 1,
			"items": {
				"TgKfdDFezqA9SQvYa": {
					"_id": "TgKfdDFezqA9SQvYa",
					"tags": [
						{
							"name": "Pacotes",
							"url": "pacotes",
							"tagsGroup": "Pacotes"
						}
					],
					"pictures": [
						"https://s3-sa-east-1.amazonaws.com/lojainteligente/itens/7de2f1bd-f7ca-48e3-8001-aa8471092c5b.png"
					],
					"name": "Solteiro",
					"url": "solteiro",
					"price": 199,
					"name_nd": "solteiro",
					"quant": 1,
					"options": {},
					"total": 199
				}
			},
			"itemsCount": 1,
			"itemsTotal": 199,
			"shippingPrice": 0,
			"total": 199
		},
		"customer": {
			"firstName": "Bruno",
			"lastName": "Marra",
			"phone": "31999999999",
			"company": {
				"companyId": "mHEBkZPHon6cpirTD",
				"name": "LojaInteligente",
				"username": "lojainteligente"
			},
			"customerId": "MERJCfHZAtigCq7K2",
			"document": "13135722686"
		},
		"events": [],
		"shipping": {},
		"meta": {
			"createdAt": "2017-07-12T23:00:09.118Z",
			"updatedAt": "2017-07-13T01:31:32.835Z"
		},
		"companyId": "mHEBkZPHon6cpirTD",
		"number": 2,
		"createdAt": "2017-07-12T23:00:09.320Z",
		"createdBy": "0",
		"funnelStatus": false,
		"updatedAt": "2017-07-13T01:31:32.920Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

-----------------

##**PUT /me/addresses/:id/cancel**##

Cancela um `order` do `customer` logado

**Permissões:** `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QPFyPT7qNLtpXm5o7",
		"cart": {},
		"paymentInfo": {},
		"company": {
			"companyId": "mHEBkZPHon6cpirTD",
			"name": "LojaInteligente"
		},
		"customer": {
			"customerId": "miQpLnfivbQjBnLkt",
			"name": "Diego Guimarães"
		},
		"status": [
			{
				"name": "Pedido Realizado",
				"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato.",
				"addededAt": "2017-06-15T11:56:45.997Z"
			}
		],
		"createdAt": "2017-06-14T22:49:25.754Z",
		"createdBy": "0",
		"updatedAt": "2017-06-15T12:02:57.304Z",
		"updatedBy": "0",
		"canceled": true
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Pedido não encontrado.

--------------------