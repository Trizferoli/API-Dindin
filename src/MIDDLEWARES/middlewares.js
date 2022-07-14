const jwt = require("jsonwebtoken");
const jwtSecret = require('../secret');
const conexao = require('../conexao');


const verifyToken = async (req, res, next) => {

    const { authorization } = req.headers;
    if (!authorization) { return res.status(404).json({ "mensagem": "Token não informado." }) };

    const token = authorization.replace('Bearer', '').trim();

    try {
        const { id } = jwt.verify(token, jwtSecret);
        const query = 'SELECT * FROM usuarios WHERE id = $1';
        const { rowCount, rows } = await conexao.query(query, [id]);

        if (rowCount === 0) { return res.status(401).json({ "mensagem": "Não foi possível acessar usuário." }) };

        const { senha, ...usuario } = rows[0];
        req.usuario = usuario;
        next();
    } catch (error) {

        return res.status(401).json({ "mensagem": error.message });
    }
};


const transactionExists = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM transacoes WHERE id = $1 ";
        const { rowCount } = await conexao.query(query, [id]);

        if (rowCount === 0) { return res.status(404).json({ "mensagem": "Transação não encontrada." }) };
        next();
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
}


const transactionAuthorized = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { usuario } = req;
        const logedId = usuario.id;

        const query = "SELECT * FROM transacoes WHERE id = $1 ";
        const { rowCount, rows } = await conexao.query(query, [id]);
        if (rowCount === 0) { return res.status(404).json({ "mensagem": "Transação não encontrada." }) };

        const retrievedId = rows[0].usuario;
        if (logedId !== retrievedId) { return res.status(403).json({ "mensagem": "Você não tem permição para alterar esta transação." }) }
        next();
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
}

const categoryExists = async (req, res, next) => {
    const { categoria_id } = req.body;
    if (!categoria_id) { return res.status(400).json({ "mensagem": "O campo categoria_id precisa ser preenchido." }) }
    try {
        const query = 'SELECT * FROM categorias WHERE id = $1';
        const { rowCount } = await conexao.query(query, [categoria_id]);

        if (rowCount === 0) { return res.status(400).json({ "mensagem": "A categoria escolhida não existe" }) }
        next();
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
}

module.exports = { verifyToken, transactionExists, categoryExists, transactionAuthorized };