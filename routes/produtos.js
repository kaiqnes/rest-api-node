const express = require('express')
const router = express.Router()

const upload = require('../multer')
const login = require('../middleware/login')
const product_controller = require('../controllers/produtos-controller')

router.get('/', product_controller.getAllProducts)
router.get('/:id_produto', product_controller.getProduct)

router.post('/', login.obrigatorio, upload.single('produto_imagem'), product_controller.postProduct)

router.patch('/', login.obrigatorio, product_controller.patchProduct)

router.delete('/', login.obrigatorio, )

module.exports = router
