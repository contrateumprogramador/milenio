# Auth : LojaInteligente #

**Endpoint:** `/auth`

--------------------

## Ações ##
##**POST /login**##

Loga `user`

**Permissões:** `*`

**Request Body**

```
#!json

{
    "email": "dev@lojainteligente.com",
    "password": "loja!api"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"authToken": "Yk7ajyYYVWpyVIvfL11ngOOeKQbBdFFi4IXm6NQjG31",
		"userId": "4ff8YtDHHN3bbec4r"
	}
}
```
**Status Code**

* `401` Não autorizado.

Os dados da resposta devem ser usados no `HEADER` de todas as outras requisições na API

```
#!

X-Auth-Token: Yk7ajyYYVWpyVIvfL11ngOOeKQbBdFFi4IXm6NQjG31
X-User-Id: 4ff8YtDHHN3bbec4r
```

-----------------
##**POST /logout**##

Desloga `user` no servidor

**Permissões:** `*`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"message": "Você foi deslogado."
	}
}
```

-----------------
##**GET /check**##

Verifica se `authToken`é válido

**Permissões:** `*`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"message": "Autorizado."
	}
}
```

**Status Code**

* `401` Não autorizado.

-----------------
##**GET /me**##

Retorna `user` logado

**Permissões:** `*`

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"_id": "4ff8YtDHHN3bbec4r",
		"username": "dev@lojainteligente.com",
		"emails": [
			{
				"address": "dev@lojainteligente.com"
			}
		],
		"profile": {
			"firstname": "API",
			"lastname": "lojainteligente",
			"company": {
				"companyId": "gqP4wxrHY8uLyks2x",
				"name": "LojaInteligente",
				"username": "lojainteligente"
			}
		},
		"roles": ['api']
	}
}
```
-----------------
##**POST /register**##

Cria `user` no role `customer`

O `password` é gerado automaticamente.
Gera uma senha aleatória e envia por e-mail para o `user`

**Permissões:** `api`

**Request Body**

```
#!json

{
  "email": "email@lojainteligente.com",
  "profile": {
    "firstName": "Guima",
    "lastName": "Ferreira",
    "phone": "31999999999"
  }
}
```

**Response**
Retorna `authToken` e `userId` já conectados do novo usuário
```
#!json

{
	"status": "success",
	"data": {
		"authToken": "L7W-vXNEsZ6SoAzgZoiFsBTUUKINNcdzWxr9EvhGDXN",
		"userId": "MyCnFqYLc8u32JMj3"
	}
}
```
**Status Code**

* `304` Usuário já existe.

-----------------
##**POST /password_change**##

Altera `password` do `user` logado

**Permissões:** `*`

**Request Body**

```
#!json

{
    "password": "loja!api",
    "newPassword": "novaSenha"
}
```

**Response**

```
#!json

{
	"status": "success",
	"data": {
		"message": "Senha alterada."
	}
}
```
**Status Code**

* `304` Senha incorreta.
* `403` Sem permissão para alterar senha deste usuário.

-----------------