const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

const URL_BASE_PRODUTOS = 'http://localhost:3000/produtos/'

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT ped.id_pedido,
                    ped.quantidade,
                    pro.id_produto,
                    pro.nome,
                    pro.preco
               FROM pedidos ped
         INNER JOIN produtos pro
                 ON ped.id_produto = pro.id_produto;`,
            (error, result, fields) => {
                conn.release()
                if(error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os pedidos'
                    },
                    pedidos: result.map(ped => {
                        return {
                            id_pedido: ped.id_pedido,
                            quantidade: ped.quantidade,
                            produto: {
                                id_produto: ped.id_produto,
                                nome: ped.nome,
                                preco: ped.preco
                            }
                        }
                    })
                }
                return res.status(200).send({ mensagem: response })
            }
        )
    })
})

// RETORNA DETALHES DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT id_pedido, id_produto, quantidade FROM pedidos WHERE id_pedido = ?;',
            [id],
            (error, result, fields) => {
                conn.release()

                if(error) { return res.status(500).send({ error: error, response: null }) }

                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: 'Este pedido não foi encontrado'
                    })
                }
                
                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna detalhes de um pedido'
                        }
                    }
                }

                return res.status(201).send({ response })
            }
        )
    })
})

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, result, fields) => {
                // conn.release()
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: 'Este ID de produto não foi encontrado'
                    })
                }

                conn.query(
                    'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?);',
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, fields) => {
                        conn.release()
                        if (error) { return res.status(500).send({ error: error }) }
                        const response = {
                            mensagem: 'Pedido criado com sucesso',
                            pedidoCriado: {
                                id_pedido: result.id_pedido,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade,
                                request: {
                                    tipo: 'POST',
                                    descricao: 'Cria um novo pedido'
                                }
                            }
                        }
        
                        return res.status(201).send({ response })
                    }
                )
            }
        )
    })
})

// REMOVE UM PEDIDO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM pedidos WHERE id_pedido = ?;',
            [req.body.id_pedido],
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Remove um pedido'
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
})

module.exports = router
