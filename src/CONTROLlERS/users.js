const conexao = require('../conexao');
const securePassword = require('secure-password');
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const schemaRegisterUser = require('../validacoes/registerUser');
const schemaLoginUser = require('../validacoes/loginUser');

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET_KEY;

const queryCheckForDuplcatesEmail = 'SELECT * FROM usuarios WHERE email = $1';

const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body;
    let hash = '';


    try {
        await schemaRegisterUser.validate(req.body);

        hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

        const existingUser = await conexao.query(queryCheckForDuplcatesEmail, [email]);
        if (existingUser.rowCount !== 0) { return res.status(400).json({ "mensagem": "Este email já está cadastrado." }) };

        const query = 'INSERT INTO usuarios(nome, email, senha) VALUES ($1,$2,$3) RETURNING *';
        const usuario = await conexao.query(query, [nome, email, hash]);
        if (usuario.rowCount === 0) { return res.status(400).json({ "mensagem": "Não foi possível cadastrar usuário." }) };
        return res.status(201).json({ 'id': `${usuario.rows[0].id}`, nome, email });
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
}



const logInUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        await schemaLoginUser.validate(req.body);

        const usuario = await conexao.query('SELECT * FROM usuarios WHERE email ILIKE $1', [email]);
        if (usuario.rowCount === 0) { return res.status(404).json({ "mensagem": "Dados fornecidos incorretos." }) };
        const { id, nome } = usuario.rows[0];


        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.rows[0].senha, "hex"));
        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json("Email ou senha incorretos.");
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    const query = 'update usuarios set senha = $1 where email = $2';
                    await conexao.query(query, [hash, email]);
                } catch {
                }
                break;
        }

        const token = jwt.sign({ id }, jwtSecret, { expiresIn: '2h' });
        return res.status(200).json({ 'usuario': { id, nome, email }, token });

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }

};



const getUser = async (req, res) => {
    const { usuario } = req;
    return res.status(200).json(usuario);

};



const attUser = async (req, res) => {
    const { usuario } = req;
    const { nome, email, senha } = req.body;
    let hash = '';

    try {
        await schemaRegisterUser.validate(req.body);

        const existingUser = await conexao.query(queryCheckForDuplcatesEmail, [email]);
        if (existingUser.rowCount === 0) { return res.status(400).json({ "mensagem": "Este email não está cadastrado." }) }

        hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

        const query = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4';
        const { rowCount } = await conexao.query(query, [nome, email, hash, usuario.id]);

        if (rowCount === 0) { return res.status(404).json({ "mensagem": "Não foi possível atualizar o usuário." }) }
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message })
    }

    return res.status(204).json();
};

module.exports = { registerUser, logInUser, getUser, attUser };
