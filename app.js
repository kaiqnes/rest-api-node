const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

app.use(morgan('dev')) // Vai logar no console todas as entradas
app.use(bodyParser.urlencoded({ extended: false })) // Aceitará apenas dados simples
app.use(bodyParser.json()) // Aceitará JSON no body

// TRATAMENTO DE CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') // Permitindo requisições de todos
    // res.header('Access-Control-Allow-Origin', 'https://meuServer.com.br') // Permitindo apenas de server específico
    res.header('Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }

    next()
})

// ROTAS ESPECÍFICAS
const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')

app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)

// MENSAGEM DE ERRO 404
app.use((req, res, next) => {
    const error = new Error('Não encontrado')
    error.status = 404
    next(error)
})

// MENSAGEM DE ERRO 500
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app