var express = require("express");
var redis = require('redis');
var path = require('path');
var client = redis.createClient();

var app = express();
var port = process.argv[2] || 3000;

app.use(express.static(path.join(__dirname, '../server')))

app.get('/',function (req, res) {

    res.sendfile('views/index.html');
    // client.set('allRank',JSON.stringify(data),redis.print);
})
app.get('/server',function (req, res) {
    res.sendfile('index.html');
})
app.get('/dotaMax-api/getAllData',function (req, res) {
    getAllData('allData').then(function (reply) {
        // console.log(reply);
        res.send(reply);
    });
})
//获取直播列表
app.get('/dotaMax-api/getLiveData',function (req, res) {
    res.setHeader( 'Access-Control-Allow-Origin','*');
    new Promise(function (resolve, reject) {
        getAllData('allLive').then(function (reply) {
            // console.log(reply);
            // res.send(reply);
            if (!reply) {
                reject('get noting!')
            }else {
                resolve(reply)
            }
            return reply;
        }).then(function (reply) {
            if (typeof reply == 'string') {
                reply = JSON.parse(reply);
            }
            return reply;
        }).then(function (reply) {
            res.json({
                status: 200,
                des: 'success',
                data: reply
            })
        }).catch(function (err) {
            res.json({
                status: 400,
                des: err,
            })
        })
    })


})

function getAllData(key) {
    return new Promise(function (resolve, reject) {
        client.get(key,function (err, reply) {
            if (err) {
                reject(err)
            }else {
                resolve(reply);
            }
        })
    })
}


var server = app.listen(3000,function () {
    console.log('server running at http://127.0.0.1:3000');
})