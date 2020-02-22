const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((errorConn, conn) => {
        if (errorConn) { return res.status(500).send({ error: errorConn }) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (errorSelect, resultSelect) => {
            if (errorSelect) { return res.status(500).send({ error: errorSelect }) }
            if(resultSelect.length > 0) {
                conn.release()
                return res.status(409).send({ mensagem: 'Usuário já cadastrado' })
            } else {
                bcrypt.hash(req.body.senha, 10, (errorBcrypt, hash) => {
                    if(errorBcrypt) { return res.status(500).send({ error: errorBcrypt }) }
                    conn.query(
                        'INSERT INTO usuarios (email, senha) VALUES (?,?)', [req.body.email, hash], (errorInsert, resultInsert) => {
                            conn.release()
                            if(errorInsert) { return res.status(500).send({ error: errorInsert }) }
                            const response = {
                                mensagem: 'Usuário criado com sucesso',
                                usuarioCriado: {
                                    id_usuario: resultInsert.insertId,
                                    email: req.body.email
                                }
                            }
                            return res.status(201).send(response)
                        }
                    )
                })
            }
        })
    })
})

router.post('/login', (req, res, next) => {
    mysql.getConnection((errorConn, conn) => {
        if (errorConn) { return res.status(500).send({ error: errorConn }) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (errorSelect, resultSelect) => {
            conn.release()
            if (errorSelect) { return res.status(500).send({ error: errorSelect }) }
            if(resultSelect.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
            } else {
                bcrypt.compare(req.body.senha, resultSelect[0].senha, (errorBcrypt, resultBcrypt) => {
                    if(errorBcrypt) { return res.status(401).send({ mensagem: 'Falha na autenticação' }) }
                    
                    if(resultBcrypt) { 
                        const token = jwt.sign({
                            id_usuario: resultSelect[0].id_usuario,
                            email: resultSelect[0].email
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        })
                        return res.status(200).send({
                            mensagem: 'Autenticado com sucesso',
                            token: token
                        })
                    }

                    return res.status(401).send({ mensagem: 'Falha na autenticação' })

                })
            }
        })
    })
})

module.exports = router