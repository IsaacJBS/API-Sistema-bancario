const contaBancaria = require('../src/bancodedados');
const {format} = require('date-fns');
const { validarCpfOuEmail } = require('../validacoes.js')

let numPrimeiraConta = 1;
let saldoInicial = 0;
const hoje = new Date();
const dataAtual = format(hoje, 'yyyy-MM-dd HH:mm:ss');
const {contas, transferencias, depositos, saques, banco} = contaBancaria;

function consultarContas(req, res) {
    const { senha_banco } = req.query;

    if (senha_banco === banco.senha) {
    return res.status(200).json(contas);
    }

    return res.status(404).json({mensagem : "A senha bancária informada é inválida!"});
};

function criarConta(req, res) {
    const validacao = validarCpfOuEmail(req.body);

    const novaConta = {
        numeroDaConta: numPrimeiraConta,
        nome: req.body.nome,
        cpf: req.body.cpf,
        data_nascimento: req.body.data_nascimento,
        telefone: req.body.telefone,
        email: req.body.email,
        senha: req.body.senha,
        saldo: saldoInicial
    }

    if(validacao) {
        return res.status(400).json({mensagem: validacao});
    };

    contas.push(novaConta);
    numPrimeiraConta += 1;
    return res.status(201).json();
};

function atualizarUsuario (req, res) {
    const {numeroConta} = req.params;
    const usuarios = contas.find(usuario => usuario.numeroDaConta === Number(numeroConta));

    const validacao = validarCpfOuEmail(req.body);

    if(!usuarios)  {
        return res.status(404).json({mensagem: "Não existe usuário com a conta informada"})
    } 

    if (validacao){
        return res.status(400).json({mensagem: validacao});
    } 

    usuarios.nome = req.body.nome;
    usuarios.cpf = req.body.cpf;
    usuarios.data_nascimento = req.body.data_nascimento;
    usuarios.telefone = req.body.telefone;
    usuarios.email = req.body.email;
    usuarios.senha = req.body.senha;
    return res.status(204).json(); 
};

function excluirConta (req, res)  {
    const {numeroConta} = req.params;

    const usuarios = contas.find(usuario => usuario.numeroDaConta === Number(numeroConta));
    const indiceConta = contas.indexOf(usuarios);

    if (!usuarios)  {
        return res.status(404).json({mensagem: "Não existe usuário com a conta informada"});
    }
    
    if (usuarios.saldo === 0) {
    contas.splice(indiceConta, 1);
    return res.status(204).json()
    } 

    return res.status(403).json({mensagem: 'O saldo da conta é maior que R$ 0, por isso, ela não pode ser removida.'})
};

function depositarDinheiro (req, res) {
    const {numero_conta} = req.body;
    let {valor} = req.body;

    const usuarios = contas.find(usuario => usuario.numeroDaConta === Number(numero_conta));
    

    if (!numero_conta || !valor) {
        res.status(400).json({mensagem: "O número da conta e o valor são obrigatórios!"});
    }

    if(!usuarios) {
        return res.status(404).json({mensagem: 'Por favor, informe uma conta existente'})
    }

    if(Math.sign(valor) === 1) {
        usuarios.saldo += valor; 
        res.status(204).json();
        depositos.push({
            data: dataAtual,
            numero_conta,
            valor
        });
        return;
    } 
    
    return res.status(400).json({mensagem: 'Por favor, insira um valor positivo'})
};

function sacarDinheiro (req,res) {
    const {numero_conta, senha} = req.body;
    let {valor} = req.body;

    const usuarios = contas.find(usuario => usuario.numeroDaConta === Number(numero_conta));

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({mensagem: "O número da conta, valor, e senha são obrigatórios!"});
    }

    if(!usuarios) {
        return res.status(404).json({mensagem: 'Por favor, informe uma conta existente'});
    }
    
    if (Number(senha) !== usuarios.senha) {
        return res.status(404).json({erro: 'A senha informada está incorreta'});
    }

    if (usuarios.saldo <= 0) {
        return res.status(403).json({mensagem: "Saldo insuficiente"})
    }

    usuarios.saldo -= valor;
    res.status(204).json();
    saques.push({
        data: dataAtual,
        numero_conta,
        valor
    });
    return;
};

function transferirDinheiro (req, res) {
    const {numero_conta_origem, numero_conta_destino} = req.body;
    let {valor} = req.body;
    const {senha} = req.body;

    const contaOrigem = contas.find(usuario => usuario.numeroDaConta === Number(numero_conta_origem));
    const contaDestino = contas.find(usuario => usuario.numeroDaConta === Number(numero_conta_destino));

    if (!numero_conta_destino || !valor || !senha || !numero_conta_origem) {
        return res.status(400).json({mensagem: "O número da conta de origem e destino, valor, e senha são obrigatórios!"});
    };

    if (!contaOrigem) {
        return res.status(404).json({mensagem: 'A conta de origem não existe'});
    }

    if (!contaDestino) {
        return res.status(404).json({mensagem: 'A conta de destino não existe'});
    }

    if(Math.sign(valor) !== 1) {
        return res.status(400).json({mensagem: 'Por favor, insira um valor positivo'})
    }

    if(Number(senha) !== contaOrigem.senha) {
        return res.status(401).json({mensagem: 'A senha está incorreta'})
    }

    if (valor > contaOrigem.saldo) {
        return res.status(403).json({mensagem: 'O valor de transferência é maior que o saldo atual'})
    };

    if (contaOrigem.saldo > 0) {
        contaDestino.saldo += valor;
        contaOrigem.saldo -= valor;
        res.status(204).json();
        contaBancaria.transferencias.push({
            data: dataAtual,
               numero_conta_origem,
               numero_conta_destino,
               valor
        });
        return;
    }

    return res.status(403).json({mensagem: 'Saldo insuficiente para esta transferência'})
};

function saldoDaConta (req, res){
    const {numero_conta, senha} = req.query;
    const contaBancaria = contas.find(usuario => usuario.numeroDaConta === Number(numero_conta));

    if (!numero_conta || !senha){
        res.status(404).json({mensagem: 'Por favor, insira o número da conta e a senha'});
    }

    if (!contaBancaria) {
        return res.status(404).json({mensagem: 'Conta bancária não encontrada!'})
    }
    if (Number(senha) === contaBancaria.senha) {
        return res.status(200).json({saldo: `${contaBancaria.saldo}`})  
    } 

    res.status(403).json({mensagem: 'Senha incorreta'})
};

function extratoDaConta (req, res) {
    const {numero_conta, senha} = req.query;
    const contaBancaria = contas.find(usuario => usuario.numeroDaConta === Number(numero_conta));

    const transfEnviadas = transferencias.filter(transf => transf.numero_conta_origem === numero_conta);
    const transfRecebidas = transferencias.filter(transf => transf.numero_conta_destino === numero_conta);
    const depositosEmConta = depositos.filter(transf => transf.numero_conta === numero_conta);
    const saquesDaConta = saques.filter(transf => transf.numero_conta === numero_conta);
    

    if (!numero_conta || !senha){
        res.status(404).json({mensagem: 'Por favor, insira o número da conta e a senha'});
    };

    if (!contaBancaria) {
        return res.status(404).json({mensagem: 'Conta bancária não encontrada!'})
    } 

    if (Number(senha) !== contaBancaria.senha) {
        return res.status(403).json({mensagem: `Senha incorreta`})
    }

    return res.status(200).json({
        depositos: depositosEmConta,
        saques: saquesDaConta,
        transferenciasEnviadas: transfEnviadas,
        transferenciasRecebidas: transfRecebidas
    }); 
};

module.exports = { consultarContas, criarConta, atualizarUsuario, excluirConta, depositarDinheiro, sacarDinheiro, transferirDinheiro, saldoDaConta, extratoDaConta };