# Adm : LojaInteligente #

**Endpoint:** `/adm`

--------------------

## Ações ##
##**POST /users**##

Cria `user`

**Permissões:** `super-admin` - `admin`

**Request Body**

```
#!json

{
    "email": "guima@cupideias.com",
    "password": "cup540810",
    "profile": {
        "firstname": "Guima",
        "lastname": "Ferreira",
        "phone": "31996975408"
    },
    "roles": ["super-admin"]
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "2d5oXspjACD7YktkG",
		"createdAt": "2017-05-25T03:37:02.150Z",
		"username": "guima@cupideias.com",
		"emails": [
			{
				"address": "guima@cupideias.com",
				"verified": false
			}
		],
		"profile": {
			"firstname": "Guima",
			"lastname": "Ferreira",
			"phone": "31996975408"
		},
		"roles": [
			"super-admin"
		]
	}
}
```
**Status Code**

* `304` Usuário já existe.

-----------------

##**GET /users**##

Retorna `users`

**Permissões:** `super-admin` - `admin`

**Filtros:** `?email=guima@cupideias.com`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "nmXDjCRYL8xHcmP6b",
			"createdAt": "2017-05-25T02:45:44.864Z",
			"username": "dev@lojainteligente.com",
			"emails": [
				{
					"address": "dev@lojainteligente.com",
					"verified": false
				}
			],
			"profile": {
				"firstname": "API",
				"lastname": "lojainteligente",
				"company": {
					"companyId": "39FvHCkTLCPJS4RfM",
					"name": "LojaInteligente",
					"username": "lojainteligente"
				}
			},
			"roles": [
				"api"
			]
		}	
        ]
}
```
**Status Code**

* `403` Sem autorização.
* `404` Usuário não encontrado.

-----------------

##**GET /users/:id**##

Busca um `user`

**Permissões:** `super-admin` - `admin`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "nmXDjCRYL8xHcmP6b",
		"createdAt": "2017-05-25T02:45:44.864Z",
		"username": "dev@lojainteligente.com",
		"emails": [
			{
				"address": "dev@lojainteligente.com",
				"verified": false
			}
		],
		"profile": {
			"firstname": "API",
			"lastname": "lojainteligente",
			"company": {
				"companyId": "39FvHCkTLCPJS4RfM",
				"name": "LojaInteligente",
				"username": "lojainteligente"
			}
		},
		"roles": [
			"api"
		]
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Usuário não encontrado.

-----------------

##**PUT /users/:id**##

Atualiza um `user`

**Permissões:** `super-admin` - `admin`

**Request Body**

```
#!json

{
    "email": "guima@cupideias.com",
    "profile": {
        "firstname": "Guima",
        "lastname": "Ferreira",
        "phone": "31996975408"
    },
    "roles": ["super-admin"]
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "2d5oXspjACD7YktkG",
		"createdAt": "2017-05-25T03:37:02.150Z",
		"username": "guima@cupideias.com",
		"emails": [
			{
				"address": "guima@cupideias.com",
				"verified": false
			}
		],
		"profile": {
			"firstname": "Guima",
			"lastname": "Ferreira",
			"phone": "31996975408"
		},
		"roles": [
			"super-admin"
		]
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Usuário não encontrado.

-----------------

##**DELETE /users/:id**##

Remove um `user`

**Permissões:** `super-admin`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Usuário excluído com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Usuário não encontrado.

-----------------
##**POST /users/:id/block**##

Bloqueia um `user`

**Permissões:** `super-admin` - `admin`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "2d5oXspjACD7YktkG",
		"createdAt": "2017-05-25T03:37:02.150Z",
		"username": "guima@cupideias.com",
		"emails": [
			{
				"address": "guima@cupideias.com",
				"verified": false
			}
		],
		"profile": {
			"firstname": "Guima",
			"lastname": "Ferreira",
			"phone": "31996975408",
			"blocked": 1
		},
		"roles": [
			"super-admin"
		]
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Usuário não encontrado.

-----------------
##**POST /users/:id/unblock**##

Desbloqueia um `user`

**Permissões:** `super-admin` - `admin`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "2d5oXspjACD7YktkG",
		"createdAt": "2017-05-25T03:37:02.150Z",
		"username": "guima@cupideias.com",
		"emails": [
			{
				"address": "guima@cupideias.com",
				"verified": false
			}
		],
		"profile": {
			"firstname": "Guima",
			"lastname": "Ferreira",
			"phone": "31996975408",
			"blocked": 0
		},
		"roles": [
			"super-admin"
		]
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Usuário não encontrado.

-----------------

##**POST /plans**##

Cria `plan`

**Permissões:** `super-admin` - `admin`

**Request Body**

```
#!json

{
    "name": "A Lavanderia Online",
    "price": 300
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "AaXvhitEwefG3cArM",
		"name": "A Lavanderia Online",
		"price": 300,
		"createdAt": "2017-05-25T23:55:40.968Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `304` Plano já existe.

-----------------

##**GET /plans**##

Retorna `plans`

**Permissões:** `super-admin` - `admin`

**Response**

```
#!json
{
	"status": "success",
	"data": [
		{
			"_id": "AaXvhitEwefG3cArM",
			"name": "A Lavanderia Online",
			"price": 300,
			"createdAt": "2017-05-25T23:55:40.968Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.

-----------------

##**GET /plans/:id**##

Busca um `plan`

**Permissões:** `super-admin` - `admin`

**Response**

```
#!json
{
	"status": "success",
	"data": {
		"_id": "ojF2kqdZBS6wjTRvC",
		"name": "A Lavanderia Online",
		"price": 300,
		"createdAt": "2017-05-26T00:04:14.697Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Plano não encontrado.

-----------------

##**PUT /plans/:id**##

Atualiza um `plan`

**Permissões:** `super-admin` - `admin`

**Request Body**

```
#!json

{
    "name": "Loja Inteligente",
    "price": 5000
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "ojF2kqdZBS6wjTRvC",
		"name": "Loja Inteligente",
		"price": 5000,
		"createdAt": "2017-05-26T00:04:14.697Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T00:05:26.884Z",
		"updatedBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Plano não encontrado.

-----------------

##**DELETE /plans/:id**##

Remove um `plan`

**Permissões:** `super-admin`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Plano excluído com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Plano não encontrado.

-----------------
##**POST /companies**##

Cria `company`

**Permissões:** `super-admin` - `admin`

**Request Body**

```
#!json

{
    "name": "A Lavanderia Online",
    "document": "00000000000191",
    "contact": "André Akira",
    "phone": "11999999999",
    "email": "akira@adobe.com",
    "website": "https://www.alavanderiaonline.com.br",
    "address": {
        "zipcode": "30330160",
        "city": "Belo Horizonte",
        "state": "MG",
        "street": "Rua Viçosa",
        "district": "São Pedro",
        "number": "373",
        "complement": "Ap. 302"
    },
    "username": "alavanderiaonline",
    "apiUser": "alavanderiaonline@lojainteligente.com",
    "planId": "Fm5nYQpEQBAiqWkuc"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "Ryd2ZfwN6NWScYm5J",
		"name": "A Lavanderia Online",
		"document": "00000000000191",
		"contact": "André Akira",
		"phone": "11999999999",
		"email": "akira@adobe.com",
		"website": "https://www.alavanderiaonline.com.br",
		"address": {
			"zipcode": "30330160",
			"city": "Belo Horizonte",
			"state": "MG",
			"street": "Rua Viçosa",
			"district": "São Pedro",
			"number": "373",
			"complement": "Ap. 302"
		},
		"username": "alavanderiaonline",
		"apiUser": "alavanderiaonline@lojainteligente.com",
		"planId": "Fm5nYQpEQBAiqWkuc",
		"createdAt": "2017-05-26T00:53:18.819Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `304` Empresa já existe.

-----------------

##**GET /companies**##

Retorna `companies`

**Permissões:** `super-admin` - `admin`

**Response**

```
#!json

{
	"status": "success",
	"data": [
		{
			"_id": "Ryd2ZfwN6NWScYm5J",
			"name": "A Lavanderia Online",
			"document": "00000000000191",
			"contact": "André Akira",
			"phone": "11999999999",
			"email": "akira@adobe.com",
			"website": "https://www.alavanderiaonline.com.br",
			"address": {
				"zipcode": "30330160",
				"city": "Belo Horizonte",
				"state": "MG",
				"street": "Rua Viçosa",
				"district": "São Pedro",
				"number": "373",
				"complement": "Ap. 302"
			},
			"username": "alavanderiaonline",
			"apiUser": "alavanderiaonline@lojainteligente.com",
			"planId": "Fm5nYQpEQBAiqWkuc",
			"createdAt": "2017-05-26T00:53:18.819Z",
			"createdBy": "0"
		}
	]
}
```
**Status Code**

* `403` Sem autorização.

-----------------

##**GET /companies/:companyId**##

Busca uma `company`

**Permissões:** `super-admin` - `admin`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "Ryd2ZfwN6NWScYm5J",
		"name": "A Lavanderia Online",
		"document": "00000000000191",
		"contact": "André Akira",
		"phone": "11999999999",
		"email": "akira@adobe.com",
		"website": "https://www.alavanderiaonline.com.br",
		"address": {
			"zipcode": "30330160",
			"city": "Belo Horizonte",
			"state": "MG",
			"street": "Rua Viçosa",
			"district": "São Pedro",
			"number": "373",
			"complement": "Ap. 302"
		},
		"username": "alavanderiaonline",
		"apiUser": "alavanderiaonline@lojainteligente.com",
		"planId": "Fm5nYQpEQBAiqWkuc",
		"createdAt": "2017-05-26T00:53:18.819Z",
		"createdBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Empresa não encontrada.

-----------------

##**PUT /companies/:companyId**##

Atualiza uma `company`

**Permissões:** `super-admin` - `admin`

**Request Body**

```
#!json

{
	"name": "A Lavanderia Online",
	"document": "00000000000191",
	"contact": "Guima Ferreira",
	"phone": "11999999999",
	"email": "akira@adobe.com",
	"website": "https://www.alavanderiaonline.com.br",
	"address": {
		"zipcode": "30330160",
		"city": "Belo Horizonte",
		"state": "MG",
		"street": "Rua Viçosa",
		"district": "São Pedro",
		"number": "373",
		"complement": "Ap. 302"
	},
	"username": "newUsername",
	"apiUser": "alavanderiaonline@lojainteligente.com",
	"planId": "Fm5nYQpEQBAiqWkuc"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "Ryd2ZfwN6NWScYm5J",
		"name": "A Lavanderia Online",
		"document": "00000000000191",
		"contact": "Guima Ferreira",
		"phone": "11999999999",
		"email": "akira@adobe.com",
		"website": "https://www.alavanderiaonline.com.br",
		"address": {
			"zipcode": "30330160",
			"city": "Belo Horizonte",
			"state": "MG",
			"street": "Rua Viçosa",
			"district": "São Pedro",
			"number": "373",
			"complement": "Ap. 302"
		},
		"username": "newUsername",
		"apiUser": "alavanderiaonline@lojainteligente.com",
		"planId": "Fm5nYQpEQBAiqWkuc",
		"createdAt": "2017-05-26T00:53:18.819Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T00:58:13.493Z",
		"updatedBy": "0"
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Empresa não encontrada.

-----------------

##**DELETE /companies/:companyId**##

Remove uma `company`

**Permissões:** `super-admin`

**Response**

```
#!json

{
	"statusCode": 204,
	"data": {
		"status": "success",
		"message": "Empresa excluída com sucesso."
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Empresa não encontrada.

-----------------
##**POST /companies/:companyId/block**##

Bloqueia uma `company`

**Permissões:** `super-admin` - `admin`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "ALhQhHHFyFvtuSy6o",
		"name": "A Lavanderia Online",
		"document": "00000000000191",
		"contact": "Guima Ferreira",
		"phone": "11999999999",
		"email": "akira@adobe.com",
		"website": "https://www.alavanderiaonline.com.br",
		"address": {
			"zipcode": "30330160",
			"city": "Belo Horizonte",
			"state": "MG",
			"street": "Rua Viçosa",
			"district": "São Pedro",
			"number": "373",
			"complement": "Ap. 302"
		},
		"username": "alavanderiaonline",
		"apiUser": "alavanderiaonline@lojainteligente.com",
		"planId": "Fm5nYQpEQBAiqWkuc",
		"createdAt": "2017-05-26T00:20:11.830Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T00:44:25.668Z",
		"updatedBy": "0",
		"blocked": 1
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Empresa não encontrada.

-----------------
##**POST /users/:companyId/unblock**##

Desbloqueia uma `company`

**Permissões:** `super-admin` - `admin`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "ALhQhHHFyFvtuSy6o",
		"name": "A Lavanderia Online",
		"document": "00000000000191",
		"contact": "Guima Ferreira",
		"phone": "11999999999",
		"email": "akira@adobe.com",
		"website": "https://www.alavanderiaonline.com.br",
		"address": {
			"zipcode": "30330160",
			"city": "Belo Horizonte",
			"state": "MG",
			"street": "Rua Viçosa",
			"district": "São Pedro",
			"number": "373",
			"complement": "Ap. 302"
		},
		"username": "alavanderiaonline",
		"apiUser": "alavanderiaonline@lojainteligente.com",
		"planId": "Fm5nYQpEQBAiqWkuc",
		"createdAt": "2017-05-26T00:20:11.830Z",
		"createdBy": "0",
		"updatedAt": "2017-05-26T00:44:25.668Z",
		"updatedBy": "0",
		"blocked": 0
	}
}
```
**Status Code**

* `403` Sem autorização.
* `404` Empresa não encontrada.

-----------------