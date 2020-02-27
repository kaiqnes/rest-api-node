const express = require('express')
const router = express.Router()

const login = require('../middleware/login')
const order_controller = require('../controllers/pedidos-controller')

router.get('/', order_controller.getAllOrders)
router.get('/:id_pedido', order_controller.getOrder)

router.post('/', login.obrigatorio, order_controller.postOrder)

router.delete('/', login.obrigatorio, order_controller.deleteOrder)

module.exports = router
