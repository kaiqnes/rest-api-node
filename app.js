const express = require('express')
const app = express()

// rotas específicas
const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')

app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)

app.use((req, res, next) => {
    res.status(200).send({
        mensagem: 'Hello World!'
    })
})

module.exports = app