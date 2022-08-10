const conexao = require('../conexao');
const schemaMakeTransaction = require('../validacoes/makeTransaction');



const getUserTransactions = async (req, res) => {
    const { usuario } = req;
    let { filtro } = req.query
    const filterApplied = [];

    if (filtro) {
        filtro = filtro.replace(/[\[\]']+/g, '').split(',');
        for (let item of filtro) {
            try {
                const query = `SELECT transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data_cadastro, transacoes.usuario AS usuario_id, transacoes.categoria_id, categorias.descricao AS categoria_nome FROM transacoes LEFT JOIN categorias ON transacoes.categoria_id = categorias.id WHERE usuario = $1 AND categorias.descricao ILIKE $2`;
                const transacoes = await conexao.query(query, [usuario.id, item.trim()]);
                if (transacoes.rowCount !== 0) { filterApplied.push(...transacoes.rows); }
            } catch (error) {
                return res.status(400).json({ "mensagem": error.message });
            }
        }
        return res.status(200).json(filterApplied)
    }

    try {
        const query = 'SELECT transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data_cadastro, transacoes.usuario AS usuario_id, transacoes.categoria_id, categorias.descricao AS categoria_nome FROM transacoes LEFT JOIN categorias ON transacoes.categoria_id = categorias.id WHERE usuario = $1';
        const transacoes = await conexao.query(query, [usuario.id]);
        return res.status(200).json(transacoes.rows)
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
};


const getSpecificTransaction = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const query = 'SELECT transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data_cadastro, transacoes.usuario AS usuario_id, transacoes.categoria_id, categorias.descricao AS categoria_nome FROM transacoes LEFT JOIN categorias ON transacoes.categoria_id = categorias.id WHERE transacoes.id = $1';
        const transacao = await conexao.query(query, [id]);

        if (transacao.rowCount === 0) { return res.status(404).json({ "mensagem": "Não foi possível acessar transação." }) };

        if (usuario.id !== transacao.rows[0].usuario_id) { return res.status(403).json({ "mensagem": "Você não tem acesso a essa transação." }) }
        return res.status(200).json(transacao.rows);

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
};



const makeTransaction = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { usuario } = req;


    try {

        await schemaMakeTransaction.validate(req.body)
        const query = `INSERT INTO transacoes (tipo, valor, data_cadastro, descricao, categoria_id, usuario) VALUES($1, $2, $3, $4, $5, $6)`;
        const transaction = await conexao.query(query, [tipo, valor, data, descricao, categoria_id, usuario.id]);

        if (transaction.rowCount === 0) { return res.status(400).json({ "mensagem": "Não foi possível completar a transação" }) };
        return res.status(204).json();
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
}


const attTransaction = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;


    try {
        await schemaMakeTransaction.validate(req.body);

        const query = 'UPDATE transacoes SET descricao = $1, valor = $2, data_cadastro = $3, categoria_id = $4, tipo = $5 WHERE id = $6';
        const transaction = await conexao.query(query, [descricao, valor, data, categoria_id, tipo, id]);

        if (transaction.rowCount === 0) { return res.status(400).json({ "mensagem": "Não foi possível atualizar os dados da transação." }) };
        return res.status(200).json();
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
};


const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM transacoes WHERE id=$1'
        const transaction = await conexao.query(query, [id]);

        if (transaction.rowCount === 0) { return res.status(400).json({ "mensagem": "Não foi possível deletar a transação." }) }
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
    return res.status(200).json();
};


const getBankStatement = async (req, res) => {
    const { usuario } = req;
    let saldoEntrada = 0;
    let saldoSaida = 0;
    try {
        const querySaldo = 'SELECT sum(valor) FROM transacoes WHERE usuario = $1 AND tipo = $2';
        const entrada = await conexao.query(querySaldo, [usuario.id, 'entrada']);
        saldoEntrada = entrada.rows[0].sum;

        if (saldoEntrada === null) { saldoEntrada = 0; }
        if (entrada.rowCount === 0) { return res.status(404).json({ "mensagem": "Não foi possível obter valores de entrada." }) }

        const querySaida = 'SELECT sum(valor) FROM transacoes WHERE usuario = $1 AND tipo = $2';
        saida = await conexao.query(querySaida, [usuario.id, 'saida']);
        saldoSaida = saida.rows[0].sum;

        if (saldoSaida === null) { saldoSaida = 0; }
        if (saldoSaida.rowCount === 0) { return res.status(404).json({ "mensagem": "Não foi possível obter valores de saida." }) }

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }

    return res.status(200).json({ "entrada": Number(saldoEntrada), "saida": Number(saldoSaida) })
};


module.exports = { getUserTransactions, getSpecificTransaction, makeTransaction, attTransaction, deleteTransaction, getBankStatement }