const { Router } = require('express')
const router = Router()

const users_controller = require('../controllers/usuarios-controller')

router.post('/cadastro', users_controller.signUp)
router.post('/login', users_controller.login)

module.exports = router
