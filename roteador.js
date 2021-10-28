const express = require('express');

const roteador = express();
const {
  consultarContas, criarConta, atualizarUsuario, excluirConta, depositarDinheiro, sacarDinheiro, transferirDinheiro, saldoDaConta, extratoDaConta,
} = require('./controladores/index');
const { validarCadastroMiddleware } = require('./validacoes');

roteador.get('/contas', consultarContas);
roteador.post('/contas', validarCadastroMiddleware, criarConta);
roteador.put('/contas/:numeroConta/usuario', validarCadastroMiddleware, atualizarUsuario);
roteador.delete('/contas/:numeroConta', excluirConta);
roteador.post('/transacoes/depositar', depositarDinheiro);
roteador.post('/transacoes/sacar', sacarDinheiro);
roteador.post('/transacoes/transferir', transferirDinheiro);
roteador.get('/contas/saldo', saldoDaConta);
roteador.get('/contas/extrato', extratoDaConta);

module.exports = roteador;
