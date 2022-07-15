const { Pool } = require('pg');

const pool = new Pool({
    user: 'swcyyzzbcyseql',
    host: 'ec2-3-224-164-189.compute-1.amazonaws.com',
    database: 'd50hqil11uuc2g',
    password: 'bc41b5c51c218d091f215e3a25e7ceb7c10216db91b89e65e239d133b4e66566',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = { query };