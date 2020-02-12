const express = require('express')
const router = express.Router()

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retornará todos os pedidos'
    })
})

// RETORNA DETALHES DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido

    res.status(200).send({
        mensagem: 'Retornará os detalhes do pedido específico',
        id: id
    })
})

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Criará um novo pedido'
    })
})

// REMOVE UM PEDIDO
router.delete('/', (req, res, next) => {
    res.status(201).send({ 
        mensagem: 'Removerá um novo pedido'
    })
})

module.exports = router
