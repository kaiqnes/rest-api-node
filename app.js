const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(morgan('dev'))

// rotas específicas
const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')

app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)

// TRATAMENTO DE 404
app.use((req, res, next) => {
    const error = new Error('Não encontrado')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app