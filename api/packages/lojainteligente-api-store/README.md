# Store : LojaInteligente #

**Endpoint:** `/store`

--------------------

## Ações ##
##**POST /tags**##

Cria `tag`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
    "name": "Categorias",
    "tags": [{
        "name": "Cadeiras",
        "url": "cadeiras",
        "icon": ""
    },{
        "name": "Mesas",
        "url": "mesas",
        "icon": ""
    }]
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "PXLcEsZysRnuvwbaf",
		"name": "Categorias",
		"tags": [
			{
				"name": "Cadeiras",
				"url": "cadeiras",
				"icon": ""
			},
			{
				"name": "Mesas",
				"url": "mesas",
				"icon": ""
			}
		],
		"companyId": "39FvHCkTLCPJS4RfM",
		"createdAt": "2017-05-26T03:11:02.820Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `304` Empresa possui outro grupo de tags com mesmo nome.

-----------------

##**GET /tags**##

Retorna `tags`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Filtros:** `?name=Categorias`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "PXLcEsZysRnuvwbaf",
			"name": "Categorias",
			"tags": [
				{
					"name": "Cadeiras",
					"url": "cadeiras",
					"icon": ""
				},
				{
					"name": "Mesas",
					"url": "mesas",
					"icon": ""
				}
			],
			"companyId": "39FvHCkTLCPJS4RfM",
			"createdAt": "2017-05-26T03:11:02.820Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Grupo de tags não encontrado.

-----------------

##**GET /tags/:id**##

Busca uma `tag`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "PXLcEsZysRnuvwbaf",
		"name": "Categorias",
		"tags": [
			{
				"name": "Cadeiras",
				"url": "cadeiras",
				"icon": ""
			},
			{
				"name": "Mesas",
				"url": "mesas",
				"icon": ""
			}
		],
		"companyId": "39FvHCkTLCPJS4RfM",
		"createdAt": "2017-05-26T03:11:02.820Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Grupo de tags não encontrado.

-----------------

##**PATCH /tags/:id**##

Atualiza uma `tag`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body 1**

```
#!json

{
    "name": "Nova Categoria",
}
```

**Request Body 2**


```
#!json

{
    "tags": [{
        "name": "Cadeiras",
        "url": "cadeiras",
        "icon": ""
    },{
        "name": "Tábuas",
        "url": "tabuas",
        "icon": ""
    }]
}
```

**Response 1**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "PXLcEsZysRnuvwbaf",
		"name": "Nova Categoria",
		"tags": [
			{
				"name": "Cadeiras",
				"url": "cadeiras",
				"icon": ""
			},
			{
				"name": "Mesas",
				"url": "mesas",
				"icon": ""
			}
		],
		"companyId": "39FvHCkTLCPJS4RfM",
		"createdAt": "2017-05-26T03:11:02.820Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T03:17:35.595Z",
		"updatedBy": "0"
	}
}
```

**Response 2**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "PXLcEsZysRnuvwbaf",
		"name": "Nova Categoria",
		"tags": [
			{
				"name": "Cadeiras",
				"url": "cadeiras",
				"icon": ""
			},
			{
				"name": "Tábuas",
				"url": "tabuas",
				"icon": ""
			}
		],
		"companyId": "39FvHCkTLCPJS4RfM",
		"createdAt": "2017-05-26T03:11:02.820Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T03:16:50.650Z",
		"updatedBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Grupo de tags não encontrado.

-----------------

##**DELETE /tags/:id**##

Remove uma `tag`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Tags excluídas com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Grupo de tags não encontrado.

-----------------

##**POST /items**##

Cria `item`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
	"tags": [{
		"name": "Dia a Dia",
		"url": "dia-a-dia",
		"tagsGroup": "Categorias"
	}],
	"url": "robe-roupao",
	"price": 12,
	"active": 1,
	"name": "Robe / Roupão",
	"name_nd": "robe / roupao",
	"show": 1
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "4KdwuRmTH9tCRX6ch",
		"tags": [
			{
				"name": "Dia a Dia",
				"url": "dia-a-dia",
				"tagsGroup": "Categorias"
			}
		],
		"url": "robe-roupao",
		"price": 12,
		"active": 1,
		"name": "Robe / Roupão",
		"name_nd": "robe / roupao",
		"show": 1,
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T20:47:30.545Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `304` Empresa já possui um item com esse nome.

-----------------

##**GET /items**##

Retorna `items`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Possible Filters:** `name`,`url`,`tags`,`tags.name`,`tags.url`

**Simbols:** `$or: ;` | `$and: ,`

**Filters Exemples:**

1. Quero listar todos os produtos da para Condomínio
`GET /store/items?tags.url=condominio` //um item em um array
-----------------
2. Quero listar todas as cadeiras para Condomínio
`GET /store/items?tags.url=condominio,cadeira` //Vários itens num array com and
-----------------
3. Quero listar todas as cadeiras e chaises
`GET /store/items?tags.url=cadeira;chaise`  //Vários itens num array com or
-----------------
4. Quero ver todos os produtos relacionados do produto
GET /store/items?_id=id_1;id_2;id_3   //Vários resultados por várias strings
-----------------

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "YAtGMmo62TCbzRNbX",
			"tags": [
				{
					"name": "Dia a Dia",
					"url": "dia-a-dia",
					"tagsGroup": "Categorias"
				}
			],
			"url": "robe-roupao",
			"price": 12,
			"active": 1,
			"name": "Robe / Roupão",
			"name_nd": "robe / roupao",
			"show": 1,
			"companyId": "mHEBkZPHon6cpirTD",
			"createdAt": "2017-05-26T21:09:48.017Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Não existe itens com os parâmetros solicitados.

-----------------

##**GET /items/:id**##

Busca um `item`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "YAtGMmo62TCbzRNbX",
		"tags": [
			{
				"name": "Dia a Dia",
				"url": "dia-a-dia",
				"tagsGroup": "Categorias"
			}
		],
		"url": "robe-roupao",
		"price": 12,
		"active": 1,
		"name": "Robe / Roupão",
		"name_nd": "robe / roupao",
		"show": 1,
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T21:09:48.017Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Item não encontrado.

-----------------

##**PUT /items/:id**##

Atualiza um `item`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
	"tags": [{
		"name": "Dia a Dia",
		"url": "dia-a-dia",
		"tagsGroup": "Categorias"
	}],
	"url": "novo-roupao",
	"price": 120,
	"active": 1,
	"name": "Novo / Roupão",
	"name_nd": "novo / roupao",
	"show": 1
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "YAtGMmo62TCbzRNbX",
		"tags": [
			{
				"name": "Dia a Dia",
				"url": "dia-a-dia",
				"tagsGroup": "Categorias"
			}
		],
		"url": "novo-roupao",
		"price": 120,
		"active": 1,
		"name": "Novo / Roupão",
		"name_nd": "novo / roupao",
		"show": 1,
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T21:09:48.017Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T21:11:24.407Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Item não encontrado.

-----------------

##**DELETE /items/:id**##

Remove um `item`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Item excluído com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Item não encontrado.

-----------------

##**POST /banners**##

Cria `banner`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
	"group": "Home",
	"banners": [{
		"title": "Banner 1",
		"active": true,
		"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/9de823bb-6e83-4fcf-b15b-d687181b27aa.jpg"
	}, {
		"title": "Banner 0",
		"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/65c84a8d-ee9e-49be-a8c5-dc734ab2e584.jpg"
	}]
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QA3EZ7uSPoyPseBrY",
		"group": "Home",
		"banners": [
			{
				"title": "Banner 1",
				"active": true,
				"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/9de823bb-6e83-4fcf-b15b-d687181b27aa.jpg"
			},
			{
				"title": "Banner 0",
				"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/65c84a8d-ee9e-49be-a8c5-dc734ab2e584.jpg"
			}
		],
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T21:44:13.585Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `304` Empresa possui outro grupo de banners com mesmo nome.

-----------------

##**GET /banners**##

Retorna `banners`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Filtros:** `?groups=Home`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "fbzrrccf7eQbENrcW",
			"group": "Home",
			"banners": [
				{
					"title": "Banner 1",
					"active": true,
					"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/9de823bb-6e83-4fcf-b15b-d687181b27aa.jpg"
				},
				{
					"title": "Banner 0",
					"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/65c84a8d-ee9e-49be-a8c5-dc734ab2e584.jpg"
				}
			],
			"companyId": "mHEBkZPHon6cpirTD",
			"createdAt": "2017-05-26T21:25:53.084Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Grupo de banners não encontrado.

-----------------

##**GET /banners/:id**##

Busca um `banner`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "fbzrrccf7eQbENrcW",
		"group": "Home",
		"banners": [
			{
				"title": "Banner 1",
				"active": true,
				"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/9de823bb-6e83-4fcf-b15b-d687181b27aa.jpg"
			},
			{
				"title": "Banner 0",
				"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/65c84a8d-ee9e-49be-a8c5-dc734ab2e584.jpg"
			}
		],
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T21:25:53.084Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Grupo de banners não encontrado.

-----------------

##**PATCH /banners/:id**##

Atualiza um `banner`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body 1**

```
#!json

{
    "group": "Novo Grupo",
}
```

**Request Body 2**


```
#!json

{
	"banners": [{
		"title": "Banner 1",
		"active": true,
		"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/9de823bb-6e83-4fcf-b15b-d687181b27aa.jpg"
	}]
}
```

**Response 1**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QA3EZ7uSPoyPseBrY",
		"group": "Novo Grupo",
		"banners": [
			{
				"title": "Banner 1",
				"active": true,
				"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/9de823bb-6e83-4fcf-b15b-d687181b27aa.jpg"
			},
			{
				"title": "Banner 0",
				"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/65c84a8d-ee9e-49be-a8c5-dc734ab2e584.jpg"
			}
		],
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T21:44:13.585Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T21:46:31.820Z",
		"updatedBy": "0"
	}
}
```

**Response 2**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "QA3EZ7uSPoyPseBrY",
		"group": "Novo Grupo",
		"banners": [
			{
				"title": "Banner 1",
				"active": true,
				"url": "https://s3-sa-east-1.amazonaws.com/lojainteligente/banners/9de823bb-6e83-4fcf-b15b-d687181b27aa.jpg"
			}
		],
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T21:44:13.585Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T21:46:49.525Z",
		"updatedBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Grupo de banners não encontrado.

-----------------

##**DELETE /banners/:id**##

Remove um `banner`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Grupo de banners excluído com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Grupo de banners não encontrado.

-----------------

##**POST /faq**##

Cria `faq`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
    "question": "Como é a forma de pagamento",
    "answer": "O pagamento é totalmente seguro...."
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "4e5uBBqCsJYC8uHak",
		"question": "Como é a forma de pagamento",
		"answer": "O pagamento é totalmente seguro....",
		"companyId": "mHEBkZPHon6cpirTD",
		"index": 1,
		"createdAt": "2017-05-26T22:29:09.903Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `304` Empresa já possui essa pergunta

-----------------

##**GET /faq**##

Retorna `faq`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "H4tgSgcSnBSEptCj5",
			"question": "Como é a forma de pagamento Xxxxxxx Yyyyyyyy Zzzzzzz",
			"answer": "O pagamento é totalmente seguro....",
			"companyId": "mHEBkZPHon6cpirTD",
			"index": 1,
			"createdAt": "2017-05-26T22:08:53.441Z",
			"createdBy": "0"
		},
		{
			"_id": "4e5uBBqCsJYC8uHak",
			"question": "Como é a forma de pagamento",
			"answer": "O pagamento é totalmente seguro....",
			"companyId": "mHEBkZPHon6cpirTD",
			"index": 2,
			"createdAt": "2017-05-26T22:29:09.903Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.

-----------------

##**GET /faq/:id**##

Busca um `faq`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "4e5uBBqCsJYC8uHak",
		"question": "Como é a forma de pagamento",
		"answer": "O pagamento é totalmente seguro....",
		"companyId": "mHEBkZPHon6cpirTD",
		"index": 2,
		"createdAt": "2017-05-26T22:29:09.903Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Faq não encontrado.

-----------------

##**PUT /faq/:id**##

Atualiza um `faq`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
    "question": "Nova Pergunta",
    "answer": "O pagamento é totalmente seguro...."
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "v6yrcFifzrrNSga9n",
		"question": "Nova Pergunta",
		"answer": "O pagamento é totalmente seguro....",
		"companyId": "mHEBkZPHon6cpirTD",
		"index": 2,
		"createdAt": "2017-05-26T22:11:32.690Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T22:27:27.049Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Item não encontrado.

-----------------

##**DELETE /faq/:id**##

Remove um `faq`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Faq excluído com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Item não encontrado.

-----------------

##**POST /faq/reorder**##

Reordena os `faq` de uma empresa
Obs.: Se um id não for encontrado na empresa, não atualiza

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

["4e5uBBqCsJYC8uHak", "H4tgSgcSnBSEptCj5"]
```

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "H4tgSgcSnBSEptCj5",
			"question": "Como é a forma de pagamento Xxxxxxx Yyyyyyyy Zzzzzzz",
			"answer": "O pagamento é totalmente seguro....",
			"companyId": "mHEBkZPHon6cpirTD",
			"index": 2,
			"createdAt": "2017-05-26T22:08:53.441Z",
			"createdBy": "0",
			"updatedAt": "2017-05-26T22:36:09.734Z",
			"updatedBy": "0"
		},
		{
			"_id": "4e5uBBqCsJYC8uHak",
			"question": "Como é a forma de pagamento",
			"answer": "O pagamento é totalmente seguro....",
			"companyId": "mHEBkZPHon6cpirTD",
			"index": 1,
			"createdAt": "2017-05-26T22:29:09.903Z",
			"createdBy": "0",
			"updatedAt": "2017-05-26T22:36:09.729Z",
			"updatedBy": "0"
		}
	]
}
```

**Status Code**

* `403` Sem autorização.

-----------------

##**POST /shippings**##

Cria `shipping`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
    "zipcodes": {
        "start": 30330000,
        "end": 30330999
    },
    "rate": 0,
    "price": 0
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "DuEh5xxKCnb7bMLGB",
		"zipcodes": {
			"start": 30330000,
			"end": 30330999
		},
		"rate": 0,
		"price": 0,
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T23:56:30.714Z",
		"createdBy": "0"
	}
}
```

-----------------

##**GET /shippings**##

Retorna `shippings`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Filtros:** `?zipcode=30330999`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "DuEh5xxKCnb7bMLGB",
			"zipcodes": {
				"start": 30330000,
				"end": 30330999
			},
			"rate": 0,
			"price": 0,
			"companyId": "mHEBkZPHon6cpirTD",
			"createdAt": "2017-05-26T23:56:30.714Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Faixa de ceps não encontrada.

-----------------

##**GET /shippings/:id**##

Busca um `shipping`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "DuEh5xxKCnb7bMLGB",
		"zipcodes": {
			"start": 30330000,
			"end": 30330999
		},
		"rate": 0,
		"price": 0,
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T23:56:30.714Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Faixa de ceps não encontrada.

-----------------

##**PUT /shippings/:id**##

Atualiza um `shipping`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
    "zipcodes": {
        "start": 30330000,
        "end": 30330999
    },
    "rate": 5,
    "price": 100
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "DuEh5xxKCnb7bMLGB",
		"zipcodes": {
			"start": 30330000,
			"end": 30330999
		},
		"rate": 5,
		"price": 100,
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-26T23:56:30.714Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T23:59:27.307Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Faixa de ceps não encontrada.

-----------------

##**DELETE /shippings/:id**##

Remove um `shipping`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Faixa de ceps excluída com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Faixa de ceps não encontrada.

-----------------

##**POST /terms**##

Cria `terms`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
    "name": "Termos e Condições",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis tristique ante..."
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "vk6qqav993ZFony2R",
		"name": "Termos e Condições",
		"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis tristique ante...",
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-27T00:19:28.357Z",
		"createdBy": "0"
	}
}
```

-----------------

##**GET /terms**##

Retorna `terms`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Filtros:** `?name=Termos e Condições`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "vk6qqav993ZFony2R",
			"name": "Termos e Condições",
			"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis tristique ante...",
			"companyId": "mHEBkZPHon6cpirTD",
			"createdAt": "2017-05-27T00:19:28.357Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Termos não encontrados.

-----------------

##**GET /terms/:id**##

Busca um `term`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "vk6qqav993ZFony2R",
		"name": "Termos e Condições",
		"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis tristique ante...",
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-27T00:19:28.357Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Termos não encontrados.

-----------------

##**PUT /terms/:id**##

Atualiza um `term`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
    "name": "Novos Termos e Condições",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "vk6qqav993ZFony2R",
		"name": "Novos Termos e Condições",
		"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-05-27T00:19:28.357Z",
		"createdBy": "0",
		"updatedAt": "2017-05-27T00:23:53.953Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Termos não encontrados.

-----------------

##**DELETE /terms/:id**##

Remove um `term`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Termos excluídos com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Termos não encontrados.

-----------------

##**POST /coupons**##

Cria `coupom`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`

**Request Body**

```
#!json

{
    "rate": 0,
    "price": 0
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "PWWdJrbtC2djFj3tT",
		"rate": 0,
		"price": 0,
		"user": {
			"userId": "izBicEdLPjkKFijhb",
			"firstname": "Guima",
			"lastname": "Ferreira"
		},
		"companyId": "mHEBkZPHon6cpirTD",
		"code": "ozxNr",
		"createdAt": "2017-06-02T22:54:27.008Z",
		"createdBy": "0"
	}
}
```

-----------------

##**GET /coupons**##

Retorna `coupons`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "Rt7Tzqb2RDpoYRa4u",
			"rate": 0,
			"price": 0,
			"user": {
				"userId": "izBicEdLPjkKFijhb",
				"firstname": "Guima",
				"lastname": "Ferreira"
			},
			"companyId": "mHEBkZPHon6cpirTD",
			"code": "f7av6",
			"createdAt": "2017-06-02T22:50:56.091Z",
			"createdBy": "0",
			"updatedAt": "2017-06-02T23:20:55.863Z",
			"updatedBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.

-----------------

##**GET /coupons/:id**##

Busca um `coupon` pelo id

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "Rt7Tzqb2RDpoYRa4u",
		"rate": 0,
		"price": 0,
		"user": {
			"userId": "izBicEdLPjkKFijhb",
			"firstname": "Guima",
			"lastname": "Ferreira"
		},
		"companyId": "mHEBkZPHon6cpirTD",
		"code": "f7av6",
		"createdAt": "2017-06-02T22:50:56.091Z",
		"createdBy": "0",
		"updatedAt": "2017-06-02T23:20:55.863Z",
		"updatedBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Cupom não encontrado.

-----------------

##**GET /coupons/:code**##

Busca um `coupon` pelo code

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `webmaster`, `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "Rt7Tzqb2RDpoYRa4u",
		"rate": 0,
		"price": 0,
		"user": {
			"userId": "izBicEdLPjkKFijhb",
			"firstname": "Guima",
			"lastname": "Ferreira"
		},
		"companyId": "mHEBkZPHon6cpirTD",
		"code": "f7av6",
		"createdAt": "2017-06-02T22:50:56.091Z",
		"createdBy": "0",
		"updatedAt": "2017-06-02T23:20:55.863Z",
		"updatedBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Cupom não encontrado.

-----------------

##**PUT /coupons/:id**##

Atualiza um `coupon`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
    "rate": 12,
    "price": 150
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "PWWdJrbtC2djFj3tT",
		"rate": 12,
		"price": 150,
		"user": {
			"userId": "izBicEdLPjkKFijhb",
			"firstname": "Guima",
			"lastname": "Ferreira"
		},
		"companyId": "mHEBkZPHon6cpirTD",
		"code": "ozxNr",
		"createdAt": "2017-06-02T22:54:27.008Z",
		"createdBy": "0",
		"updatedAt": "2017-06-02T23:08:12.696Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Cupom não encontrado.

-----------------

##**PATCH /coupons/:id**##

Atualiza um parcialmente um `coupon`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Request Body**

```
#!json

{
    "price": 45,
    "code": "novoCódigo"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "PWWdJrbtC2djFj3tT",
		"rate": 12,
		"price": 45,
		"user": {
			"userId": "izBicEdLPjkKFijhb",
			"firstname": "Guima",
			"lastname": "Ferreira"
		},
		"companyId": "mHEBkZPHon6cpirTD",
		"code": "novoCódigo",
		"createdAt": "2017-06-02T22:54:27.008Z",
		"createdBy": "0",
		"updatedAt": "2017-06-02T23:08:12.696Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Cupom não encontrado.

-----------------

##**DELETE /coupons/:id**##

Remove um `coupon`

**Permissões:** `super-admin`, `admin`, `manager`, `webmaster`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Cupom excluído com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Cupom não encontrado.

-----------------

##**PUT /coupons/:id/use**##

Usa um `coupon`

**Permissões:** `super-admin`, `admin`, `manager`, `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "Rt7Tzqb2RDpoYRa4u",
		"rate": 0,
		"price": 0,
		"user": {
			"userId": "izBicEdLPjkKFijhb",
			"firstname": "Guima",
			"lastname": "Ferreira"
		},
		"companyId": "mHEBkZPHon6cpirTD",
		"code": "f7av6",
		"createdAt": "2017-06-02T22:50:56.091Z",
		"createdBy": "0",
		"used": true,
		"updatedAt": "2017-06-02T23:20:55.863Z",
		"updatedBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Cupom não encontrado.

-----------------

##**POST /status**##

Cria `status`

**Permissões:** `super-admin`, `admin`, `manager`

**Request Body**

```
#!json

{
	"status": [{
		"name": "Pedido Realizado",
		"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato."
	},{
		"name": "Pagamento Confirmado",
		"message": "Seu pagamento foi confirmado, em breve seu pedido estará em produção."
	}]
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "HnzA8kdL27ogbbRnL",
		"status": [
			{
				"name": "Pedido Realizado",
				"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato."
			},
			{
				"name": "Pagamento Confirmado",
				"message": "Seu pagamento foi confirmado, em breve seu pedido estará em produção."
			}
		],
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-06-07T00:05:26.834Z",
		"createdBy": "0"
	}
}
```

-----------------

##**GET /status**##

Retorna `status`

**Permissões:** `super-admin`, `admin`, `manager`, `api`

**Filtros:** `?name=Pedido Realizado`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "HnzA8kdL27ogbbRnL",
			"status": [
				{
					"name": "Pedido Realizado",
					"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato."
				},
				{
					"name": "Pagamento Confirmado",
					"message": "Seu pagamento foi confirmado, em breve seu pedido estará em produção."
				}
			],
			"companyId": "mHEBkZPHon6cpirTD",
			"createdAt": "2017-06-07T00:05:26.834Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Status não encontrados.

-----------------

##**GET /status/:id || /status/:name**##

Busca um `status`

**Permissões:** `super-admin`, `admin`, `manager`, `api`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "PWwqrY4haxovEYHCT",
		"status": [
			{
				"name": "Pedido Realizado",
				"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato."
			},
			{
				"name": "Pagamento Confirmado",
				"message": "Seu pagamento foi confirmado, em breve seu pedido estará em produção."
			}
		],
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-06-06T23:41:31.629Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Status não encontrados.

-----------------

##**PUT /status/:id || /status/:name**##

Atualiza um `status`

**Permissões:** `super-admin`, `admin`, `manager`

**Request Body**

```
#!json

{
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
		"_id": "HnzA8kdL27ogbbRnL",
		"status": [
			{
				"name": "Pedido Realizado",
				"message": "Recebemos seu pedido e estamos aguardando a confirmação de pagamento. Em breve entraremos em contato."
			}
		],
		"companyId": "mHEBkZPHon6cpirTD",
		"createdAt": "2017-06-07T00:05:26.834Z",
		"createdBy": "0",
		"updatedAt": "2017-06-07T00:05:44.189Z",
		"updatedBy": "0"
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Status não encontrados.

-----------------

##**DELETE /status/:id || /status/:name**##

Remove um `status`

**Permissões:** `super-admin`, `admin`, `manager`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Status excluídos com sucesso."
	}
}
```

**Status Code**

* `403` Sem autorização.
* `404` Status não encontrados.

-----------------

##**GET /settings**##

Retorna as `settings` da empresa

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "599230d00a984e00167aebe6",
		"installments": {
			"min": 0,
			"maxInstallments": 1
		},
		"companyId": "72WPdipXiBZGa2CBX",
		"updatedAt": "2017-08-15T21:34:41.920Z",
		"updatedBy": "nmHBBRm9iJe4NMxYM"
	}
}
```
**Status Code**

* `403` Sem autorização.

-----------------

##**GET /sections**##

Retorna `sections`

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `customer`

**Possible Filters:** `_id`, `name`,`url`,`subSections`,`subSections.name`,`subSections.url`

**Simbols:** `$or: ;` | `$and: ,`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "YAtGMmo62TCbzRNbX",
      "name": "Subseção",
      "name_nd": "subsecao",
      "url": "subsecao",
			"subSections": [
				{
					"name": "Dia a Dia",
					"url": "dia-a-dia",
					"tagsGroup": "Categorias"
				}
			]
		}
	]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Não existe itens com os parâmetros solicitados.

-----------------

##**GET /sections/:id**##

Retorna uma `section` específica

**Permissões:** `super-admin`, `admin`, `manager`, `api`, `customer`

**Response**

```
#!json

{
	"status": "success",
	"data": {
			"_id": "YAtGMmo62TCbzRNbX",
      "name": "Subseção",
      "name_nd": "subsecao",
      "url": "subsecao",
			"subSections": [
				{
					"name": "Dia a Dia",
					"url": "dia-a-dia",
					"tagsGroup": "Categorias"
				}
			]
		}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Não existe itens com os parâmetros solicitados.

-----------------
