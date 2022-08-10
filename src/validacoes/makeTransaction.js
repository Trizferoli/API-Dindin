const yup = require('./config');

const schemaMakeTransaction = yup.object().shape({
    descricao: yup.string().required(),
    categoria_id: yup.number().required().oneOf([
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]),
    tipo: yup.string().required().oneOf(['entrada', 'saida']),
    data: yup.date().required(),
    valor: yup.number().required()
})

module.exports = schemaMakeTransaction;