const jwt = require('jsonwebtoken')
const msg = require('../src/constants/contants')

exports.mandatory = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)

        req.usuario = decode
        next()
    } catch (error) {
        return res.status(401).send({ mensagem: msg.LOGIN.FAILED})
    }
}

exports.optional = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)

        req.usuario = decode
        next()
    } catch (error) {
        next()
    }
}