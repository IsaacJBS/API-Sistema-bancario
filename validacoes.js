const banco = require('./src/bancodedados');

const { contas } = banco;

function validarCadastroMiddleware(req, res, next) {
  const {
    nome, cpf, email, data_nascimento, senha,
  } = req.body;
  if (!nome) {
    return res.status(400).json({ mensagem: 'O nome do cliente é obrigatório' });
  }
  if (!cpf) {
    return res.status(400).json({ mensagem: 'O CPF do cliente é obrigatório' });
  }
  if (!email) {
    return res.status(400).json({ mensagem: 'O email do cliente é obrigatório' });
  }
  if (!data_nascimento) {
    return res.status(400).json({ mensagem: 'A data de nascimento do cliente é obrigatória' });
  }
  if (!senha) {
    return res.status(400).json({ mensagem: 'A senha do cliente é obrigatória' });
  }

  next();
}

function validarCpfOuEmail(cliente) {
  const validaCpf = contas.find((conta) => conta.cpf === cliente.cpf);
  const validaEmail = contas.find((email) => email.email === cliente.email);
  const numero = Number(cliente.cpf);

  if (validaCpf) {
    return 'Já existe uma conta com o CPF informado';
  }

  if (validaEmail) {
    return 'Já existe uma conta com o e-mail informado';
  }

  if (cliente.cpf.length !== 11) {
    return 'O CPF informado precisa ter 11 (onze) caracteres';
  }

  if (isNaN(numero)) {
    return 'Apenas números são aceitos';
  }
}

module.exports = { validarCpfOuEmail, validarCadastroMiddleware };
