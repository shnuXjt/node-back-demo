var express = require('express');
var multer = require('multer');
var multipart = require('connect-multiparty');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

var app = express();
var router = express.Router();
var uploadDwg = require('./control/fileupload');
var multipartMiddleware = multipart();

var converter = "/converters/ax2019/windows/AX2019.exe";

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

app.post('/upload', uploadDwg.single('dwgfile'), function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    if(req.file) {
        // res.json({message: '文件上传成功'});
        console.log(req.file);
        console.log(req.body);
        let outFileLocation = req.file.path;
        console.log('url: ', __dirname);
        console.log('process: ', process.cwd());
        exec(path.join(__dirname, converter) + ' -i=' + outFileLocation + ' -o='+ path.join(__dirname, 'converters/files/' + req.file.filename.split('.')[0] + '.svg') +' -f="svg" -model -tl="RM$TXT" -rl="RM$"',function(error, stdout, stderr){
            if(error) {
                console.error('error: ' + error);
                // return;
            }
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);

            fs.stat(path.join(__dirname, 'converters/files/' + req.file.filename.split('.')[0] + '.svg'), function(err, stats) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log('stats: ', stats);
                    if (stats.isFile()) {
                        fs.readFile(path.join(__dirname, 'converters/files/' + req.file.filename.split('.')[0] + '.svg'), function(err, data){
                            if(err) {
                                return console.error(err);
                            }
                            console.log('data: ', data);
                            // console.log('dataString: ', data.toString());
                            res.send(data.toString());
                        });
                    } else {
                        console.log('file can not get');
                    }
                }
            });
        })
    } else {
        res.json({'ok': false})
    }
});

var server = app.listen(3000, function() {
    console.log('example app listening on port 3000');
});