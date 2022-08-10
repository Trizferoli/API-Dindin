const yup = require('./config')

const schemaRegisterUser = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().required()
});

module.exports = schemaRegisterUser;