const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

const URL_BASE_PRODUTOS = 'http://localhost:3000/produtos/'

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT id_produto, nome, preco FROM produtos;',
            (error, result, fields) => {
                conn.release()
                if(error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os protudos'
                            }
                        }
                    })
                }
                return res.status(200).send({ mensagem: response })
            }
        )
    })
})

// RETORNA DETALHES DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT id_produto, nome, preco FROM produtos WHERE id_produto = ?;',
            [id],
            (error, result, fields) => {
                conn.release()

                if(error) { return res.status(500).send({ error: error, response: null }) }

                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: 'Este produto não foi encontrado'
                    })
                }
                
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna detalhes de um produdo'
                        }
                    }
                }

                return res.status(201).send({ response })
            }
        )
    })
})

// INSERE UM PRODUTO
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?);',
            [req.body.nome, req.body.preco],
            (error, result, fields) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto criado com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'Cria um novo produdo'
                        }
                    }
                }

                return res.status(201).send({ response })
            }
        )
    })
})

// ATUALIZA UM PRODUTO
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos
                SET nome = ?,
                    preco = ?
                WHERE id_produto = ?;`,
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto criado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Cria um novo produdo'
                        }
                    }
                }

                return res.status(202).send({ response })
            }
        )
    })
})

// REMOVE UM PRODUTO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?;',
            [req.body.id_produto],
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Remove um produto'
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
})

module.exports = router
