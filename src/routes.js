const express = require('express');
const routes = express();
const categories = require('./CONTROLLERS/categories');
const transactions = require('./CONTROLlERS/transactions');
const users = require('./CONTROLlERS/users');
const middlewares = require('./MIDDLEWARES/middlewares')

//USER
routes.post('/usuario', users.registerUser);
routes.post('/login', users.logInUser);
routes.get('/usuario', middlewares.verifyToken, users.getUser);
routes.put('/usuario', middlewares.verifyToken, users.attUser);

//CATEGORIES
routes.get('/categoria', middlewares.verifyToken, categories);

//TRANSACTIONS
routes.get('/transacao', middlewares.verifyToken, transactions.getUserTransactions);
routes.get('/transacao/extrato', middlewares.verifyToken, transactions.getBankStatement);
routes.get('/transacao/:id', middlewares.verifyToken, middlewares.transactionExists, transactions.getSpecificTransaction);
routes.post('/transacao', middlewares.verifyToken, middlewares.categoryExists, transactions.makeTransaction);
routes.put('/transacao/:id', middlewares.verifyToken, middlewares.transactionAuthorized, middlewares.categoryExists, transactions.attTransaction);
routes.delete('/transacao/:id', middlewares.verifyToken, middlewares.transactionAuthorized, transactions.deleteTransaction);
module.exports = routes;

