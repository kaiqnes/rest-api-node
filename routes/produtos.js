const express = require('express')
const router = express.Router()

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retornará todos os produtos'
    })
})

// RETORNA DETALHES DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    if (id === 'especial') {
        res.status(200).send({
            mensagem: 'Você descobriu o ID especial - EasterEgg',
            id: id
        })
    }

    res.status(200).send({
        mensagem: 'Retornará os detalhes do produto específico',
        id: id
    })
})

// INSERE UM PRODUTO
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Criará um novo produto'
    })
})

// ATUALIZA UM PRODUTO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Atualizará um novo produto'
    })
})

// REMOVE UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Removerá um novo produto'
    })
})

module.exports = router
