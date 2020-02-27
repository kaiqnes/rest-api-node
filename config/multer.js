const multer = require('multer')

const destination = function (req, file, cb) {
    cb(null, './uploads/')
}

const fileName = function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
}

const fileFilterCnf = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const storageCnf = multer.diskStorage({
    destination: destination,
    filename: fileName
})

const upload = multer({ 
    storage: storageCnf,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilterCnf
})

module.exports = upload
