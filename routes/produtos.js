const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT id_produto, nome, preco FROM produtos;',
            (error, result, fields) => {
                conn.release()

                if(error) { return res.status(500).send({ error: error, response: null }) }

                return res.status(200).send({ mensagem: result })
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

                return res.status(200).send({ mensagem: result })
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

                return res.status(201).send({
                    mensagem: 'Produto criado com sucesso',
                    produtoCriado: result.insertId
                })
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

                return res.status(202).send({
                    mensagem: 'Produto alterado com sucesso'
                })
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

                return res.status(202).send({
                    mensagem: 'Produto removido com sucesso'
                })
            }
        )
    })
})

module.exports = router
