# API Sistema Bancário 💰

 Esta API Restful é um projeto piloto, que irá ser melhorada com mais funcionalidades. Os dados são persistidos em memória, no objeto existente dentro do arquivo bancodedados.js, ou seja, caso reinicie a API, os dados são perdidos. Até o momento, ela permite: 
 
- Criar conta bancária

- Listar contas bancárias

- Atualizar os dados do usuário da conta bancária

- Excluir uma conta bancária

- Depósitar em uma conta bancária

- Sacar de uma conta bancária

- Transferir valores entre contas bancárias

- Consultar saldo da conta bancária

- Emitir extrato bancário

# Instalação

Para testar o projeto basta:

1. Realizar o clone do projeto.
2. Instalar o cliente HTTP, é recomendado o insomnia.
3. Utilizar o comando `npm install express`.
4. Utilizar o comando `npm install -D nodemon`.
5. No terminal, utilizar o comando `npx nodemon index.js` e acessar a API na porta 8000.

### Estrutura do objeto no arquivo `bancodedados.js`

<hr>
  
```javascript
{
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
    ],
    saques: [
    ],
    depositos: [
    ],
    transferencias: [
    ],
}
```

# Rotas


#### `GET` `/contas?senha_banco=Cubos123Bank`

Esse endpoint lista todas as contas bancárias existentes.
A senha padrão é Cubos123Bank, que deve ser passada como no exemplo GET acima.

#### `POST` `/contas`

#### Exemplo de Requisição

```javascript
// POST /contas
{
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
    "senha": "12345"
}
```

<hr>

#### `PUT` `/contas/:numeroConta/usuario`

Esse endpoint atualiza apenas os dados do usuário de uma conta bancária.
Todas as propriedades do objeto são obrigatórias.

#### Exemplo de Requisição

```javascript
// PUT /contas/:numeroConta/usuario
{
    "nome": "Foo Bar 3",
    "cpf": "99911122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar3.com",
    "senha": "12345"
{
```

<hr>

#### `DELETE` `/contas/:numeroConta`

Esse endpoint exclui uma conta bancária existente.

- **Requisição**

  - Numero da conta bancária (passado como parâmetro na rota).
  Exemplo: `/contas/1`
  <hr>

#### `POST` `/transacoes/depositar`

Esse endpoint soma o valor do depósito ao saldo de uma conta válida e registrar essa transação.

**Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor

#### Exemplo de Requisição

```javascript
// POST /transacoes/depositar
{
	"numero_conta": "1",
	"valor": 1900
}
```

<hr>

#### `POST` `/transacoes/sacar`

Esse endpoint realiza o saque de um valor em uma determinada conta bancária e registrar essa transação.

**Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor
    -   senha

#### Exemplo de Requisição

```javascript
// POST /transacoes/sacar
{
"numero_conta": "1",
"valor": 1900,
"senha": "123456"
}
```

<hr>

#### `POST` `/transacoes/transferir`

Esse endpoint permite a transferência de recursos (dinheiro) de uma conta bancária para outra e registra essa transação.

**Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha

#### Exemplo de Requisição

```javascript
// POST /transacoes/transferir
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "123456"
}
```

<hr>

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Esse endpoint retorna o saldo de uma conta bancária.

**Requisição** - query params

    -   numero_conta
    -   senha

```javascript
//  GET /contas/saldo
{
"numero_conta": "1",
"senha": "123456"
}
```

<hr>

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Esse endpoint lista as transações realizadas de uma conta específica.

**Requisição** - query params

    -   numero_conta
    -   senha

```javascript
//  GET /contas/extrato
{
"numero_conta": "1",
"senha": "123456"
}
```
