const mysql = require('../mysql').pool
const msg = require('../contants')

exports.getAllProducts = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT id_produto, nome, preco, imagem_produto FROM produtos;',
            (error, result, fields) => {
                conn.release()
                if(error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    quantidade: result.length,
                    request: {
                        tipo: 'GET',
                        descricao: msg.PRODUCTS.ALL_PRODUCTS_DETAILS
                    },
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto
                        }
                    })
                }
                return res.status(200).send({ mensagem: response })
            }
        )
    })
}

exports.getProduct = (req, res, next) => {
    const id = req.params.id_produto

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT id_produto, nome, preco, imagem_produto FROM produtos WHERE id_produto = ?;',
            [id],
            (error, result, fields) => {
                conn.release()
                if(error) { return res.status(500).send({ error: error, response: null }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: msg.PRODUCTS.NOT_FOUND
                    })
                }
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto,
                        request: {
                            tipo: 'GET',
                            descricao: msg.PRODUCTS.PRODUCT_DETAILS
                        }
                    }
                }
                return res.status(201).send({ response })
            }
        )
    })
}

exports.postProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error, position: 123 }) }
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?);',
            [req.body.nome, req.body.preco, req.file.path],
            (error, result, fields) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: msg.PRODUCTS.CREATED,
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request: {
                            tipo: 'POST',
                            descricao: msg.PRODUCTS.CREATED_DETAILS
                        }
                    }
                }
                return res.status(201).send({ response })
            }
        )
    })
}

exports.patchProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?;`,
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, result, fields) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: msg.PRODUCTS.UPDATED,
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'PATCH',
                            descricao: msg.PRODUCTS.UPDATED_DETAILS
                        }
                    }
                }
                return res.status(202).send({ response })
            }
        )
    })
}

exports.deleteProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?;',
            [req.body.id_produto],
            (error, result, fields) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: msg.PRODUCTS.REMOVED,
                    request: {
                        tipo: 'DELETE',
                        descricao: msg.PRODUCTS.REMOVED_DETAILS
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
}
