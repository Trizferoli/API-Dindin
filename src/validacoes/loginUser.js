const yup = require('./config');

const schemaLoginUser = yup.object().shape({
    email: yup.string().required(),
    senha: yup.string().required()
});

module.exports = schemaLoginUser