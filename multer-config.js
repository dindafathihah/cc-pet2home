var multer = require('multer');

const storage = multer.diskStorage({
    destination: 'public/upload/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + file.originalname)
    }
});

exports.imageUpload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 100000000 // 1000000 Bytes = 1 MB
    // },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})