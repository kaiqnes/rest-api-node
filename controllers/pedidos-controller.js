const mysql = require('../mysql').pool
const msg = require('../contants')

module.exports = {
    getAllOrders: (req, res, next) => {
        mysql.getConnection((error, conn) => {
            if (error) { return res.status(500).send({ error: error }) }
            conn.query(
                `SELECT ped.id_pedido, ped.quantidade, pro.id_produto, pro.nome, pro.preco
                FROM pedidos ped INNER JOIN produtos pro ON ped.id_produto = pro.id_produto;`,
                (error, result, fields) => {
                    conn.release()
                    if(error) { return res.status(500).send({ error: error, response: null }) }
                    const response = {
                        request: {
                            tipo: 'GET',
                            descricao: msg.ORDERS.ALL_ORDERS_DETAILS
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
    },
    getOrder: (req, res, next) => {
        const id = req.params.id_pedido
        mysql.getConnection((error, conn) => {
            if (error) { return res.status(500).send({ error: error }) }
            conn.query(
                'SELECT id_pedido, id_produto, quantidade FROM pedidos WHERE id_pedido = ?;',
                [id],
                (error, result, fields) => {
                    conn.release()
                    if (error) { return res.status(500).send({ error: error, response: null }) }
                    if (result.length === 0) {
                        return res.status(404).send({
                            mensagem: msg.ORDERS.NOT_FOUND
                        })
                    }
                    const response = {
                        pedido: {
                            id_pedido: result[0].id_pedido,
                            id_produto: result[0].id_produto,
                            quantidade: result[0].quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: msg.ORDERS.ORDER_DETAILS
                            }
                        }
                    }
                    return res.status(201).send({ response })
                }
            )
        })
    },
    postOrder: (req, res, next) => {
        mysql.getConnection((error, conn) => {
            if (error) { return res.status(500).send({ error: error }) }
            conn.query(
                'SELECT * FROM produtos WHERE id_produto = ?',
                [req.body.id_produto],
                (error, result, fields) => {
                    if (error) { return res.status(500).send({ error: error }) }
                    if (result.length === 0) {
                        return res.status(404).send({
                            mensagem: msg.ORDERS.PRODUCT_NOT_FOUND
                        })
                    }
                    conn.query(
                        'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?);',
                        [req.body.id_produto, req.body.quantidade],
                        (error, result, fields) => {
                            conn.release()
                            if (error) { return res.status(500).send({ error: error }) }
                            const response = {
                                mensagem: msg.ORDERS.CREATED,
                                pedidoCriado: {
                                    id_pedido: result.id_pedido,
                                    id_produto: req.body.id_produto,
                                    quantidade: req.body.quantidade,
                                    request: {
                                        tipo: 'POST',
                                        descricao: msg.ORDERS.CREATED_DETAILS
                                    }
                                }
                            }
                            return res.status(201).send({ response })
                        }
                    )
                }
            )
        })
    },
    deleteOrder: (req, res, next) => {
        mysql.getConnection((error, conn) => {
            if (error) { return res.status(500).send({ error: error }) }
            conn.query(
                'DELETE FROM pedidos WHERE id_pedido = ?;',
                [req.body.id_pedido],
                (error, result, fields) => {
                    conn.release()
                    if (error) { return res.status(500).send({ error: error }) }
                    const response = {
                        mensagem: msg.ORDERS.REMOVED,
                        request: {
                            tipo: 'DELETE',
                            descricao: msg.ORDERS.REMOVED_DETAILS
                        }
                    }
                    return res.status(202).send(response)
                }
            )
        })
    }
}
