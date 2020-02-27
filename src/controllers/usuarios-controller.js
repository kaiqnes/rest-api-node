const mysql = require('../../config/mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const msg = require('../constants/contants')


exports.signUp = (req, res, next) => {
    mysql.getConnection((errorConn, conn) => {
        if (errorConn) { return res.status(500).send({ error: errorConn }) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (errorSelect, resultSelect) => {
            if (errorSelect) { return res.status(500).send({ error: errorSelect }) }
            if (resultSelect.length > 0) {
                conn.release()
                return res.status(409).send({ mensagem: msg.USERS.ALREADY_EXIST })
            } else {
                bcrypt.hash(req.body.senha, 10, (errorBcrypt, hash) => {
                    if(errorBcrypt) { return res.status(500).send({ error: errorBcrypt }) }
                    conn.query(
                        'INSERT INTO usuarios (email, senha) VALUES (?,?)',
                        [req.body.email, hash],
                        (errorInsert, resultInsert) => {
                            conn.release()
                            if(errorInsert) { return res.status(500).send({ error: errorInsert }) }
                            const response = {
                                mensagem: msg.USERS.CREATED,
                                usuarioCriado: {
                                    id_usuario: resultInsert.insertId,
                                    email: req.body.email,
                                    request: {
                                        tipo: 'POST',
                                        descricao: msg.USERS.CREATED_DETAILS
                                    }
                                }
                            }
                            return res.status(201).send(response)
                        }
                    )
                })
            }
        })
    })
}

exports.login = (req, res, next) => {
    mysql.getConnection((errorConn, conn) => {
        if (errorConn) { return res.status(500).send({ error: errorConn }) }
        conn.query('SELECT * FROM usuarios WHERE email = ?',
        [req.body.email],
        (errorSelect, resultSelect) => {
            conn.release()
            if (errorSelect) { return res.status(500).send({ error: errorSelect }) }
            if (resultSelect.length < 1) {
                return res.status(401).send({ mensagem: msg.USERS.AUTHENTICATION_FAILED })
            } else {
                bcrypt.compare(req.body.senha, resultSelect[0].senha, (errorBcrypt, resultBcrypt) => {
                    if (errorBcrypt) { return res.status(401).send({ mensagem: msg.USERS.AUTHENTICATION_FAILED }) }
                    if (resultBcrypt) { 
                        const token = jwt.sign({
                            id_usuario: resultSelect[0].id_usuario,
                            email: resultSelect[0].email
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        })
                        const response = {
                            mensagem: msg.USERS.AUTHENTICATED,
                            token: token,
                            request: {
                                tipo: 'POST',
                                descricao: msg.USERS.AUTHENTICATION_DETAILS
                            }
                        }
                        return res.status(200).send(response)
                    }
                    return res.status(401).send({ mensagem: msg.USERS.AUTHENTICATION_FAILED })
                })
            }
        })
    })
}
