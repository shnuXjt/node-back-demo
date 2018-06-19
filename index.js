var express = require('express');
var multer = require('multer');
var multipart = require('connect-multiparty')

var app = express();
var router = express.Router();
var uploadDwg = require('./control/fileupload');
var multipartMiddleware = multipart();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

app.get('/', function(req, res) {
    res.send('server started!');
});

app.post('/upload', multipartMiddleware, function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    if(req.file) {
        res.json({message: '文件上传成功'});
        console.log(req.file);
        console.log(req.body);
    } else {
        res.json({'ok': false})
    }
});

var server = app.listen(3000, function() {
    console.log('example app listening on port 3000');
});