const express = require('express')
const router = express.Router()

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna todos os pedidos'
    })
})

// RETORNA DETALHES DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido

    res.status(200).send({
        mensagem: 'Retorna os detalhes do pedido específico',
        id: id
    })
})

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }
    
    res.status(201).send({
        mensagem: 'Cria um novo pedido',
        pedidoCriado: pedido
    })
})

// REMOVE UM PEDIDO
router.delete('/', (req, res, next) => {
    res.status(201).send({ 
        mensagem: 'Remove um novo pedido'
    })
})

module.exports = router
