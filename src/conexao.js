const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.CONNECTION_USER,
    host: process.env.CONNECTION_HOST,
    database: process.env.CONNECTION_DATABASE,
    password: process.env.CONNECTION_PASSWORD,
    port: process.env.CONNECTION_PORT
});

const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = { query };