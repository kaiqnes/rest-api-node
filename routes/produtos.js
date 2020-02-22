const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const multer = require('multer')

const storageCnf = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilterCnf = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ 
    storage: storageCnf,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilterCnf
})

const URL_BASE_PRODUTOS = 'http://localhost:3000/produtos/'

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
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
                        descricao: 'Retorna todos os protudos'
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
})

// RETORNA DETALHES DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
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
                        mensagem: 'Este produto não foi encontrado'
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
router.post('/', (upload.single('produto_imagem')), (req, res, next) => {
    console.log(req.file)
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error, position: 123 }) }
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?);',
            [req.body.nome, req.body.preco, req.file.path],
            (error, result, fields) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto criado com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
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
                            descricao: 'Atualiza um produto'
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
