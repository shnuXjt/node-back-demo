var multer = require('multer');
var md5 = require('md5');
var config = require('../config/config');

var storage = multer.diskStorage({
    destination: config.upload.path,
    filename: function (req, file, cb) {
        console.log(file);
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + md5(file) + '.' + fileFormat[fileFormat.length - 1]);
    }
})

var uploadDwg = multer({
    storage: storage
});

module.exports = uploadDwg;