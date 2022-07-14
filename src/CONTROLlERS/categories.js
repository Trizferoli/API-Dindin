const conexao = require('../conexao');
const jwt = require("jsonwebtoken");
const jwtSecret = require('../secret');
const { query } = require('express');

const categories = async (req, res) => {
    try {
        const query = 'SELECT * FROM categorias';
        const { rowCount, rows } = await conexao.query(query);

        if (rowCount === 0) { return res.status(400).json({ "mensagem": "Não foi possível listar categorias." }) };
        return res.status(200).json(rows);

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
}

module.exports = categories;