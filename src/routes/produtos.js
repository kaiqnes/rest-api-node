const { Router } = require('express')
const router = Router()

const upload = require('../../config/multer')
const login = require('../../middleware/login')

const { getAllProducts, getProduct, postProduct, patchProduct, deleteProduct } = require('../controllers/produtos-controller')
router.get('/', getAllProducts)
router.get('/:id_produto', getProduct)

router.post('/', login.mandatory, upload.single('produto_imagem'), postProduct)

router.patch('/', login.mandatory, patchProduct)

router.delete('/', login.mandatory, deleteProduct)

// const product_controller = require('../controllers/produtos-controller')
// router.get('/', product_controller.getAllProducts)
// router.get('/:id_produto', product_controller.getProduct)

// router.post('/', login.mandatory, upload.single('produto_imagem'), product_controller.postProduct)

// router.patch('/', login.mandatory, product_controller.patchProduct)

// router.delete('/', login.mandatory, product_controller.deleteProduct)

module.exports = router
