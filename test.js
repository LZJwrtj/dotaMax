var express = require("express");
var redis = require('redis');
var path = require('path');
var client = redis.createClient();

var app = express();
var port = process.argv[2] || 3000;

app.use(express.static(path.join(__dirname, '../server')))

app.get('/',function (req, res) {

    // res.sendfile('views/index.html');
    client.set('team','[1,2,3]',redis.print)
    client.get('team',redis.print);
})
app.get('/dotaMax-api/getAllData',function (req, res) {
    getAllData(res);

})
/*app.get('/login',function (req, res) {

    client.get('allData',function (err, reply) {
        console.log(reply);
        res.send(reply);
    })
})*/
app.get('/getInfo',function (req, res) {
    client.get('data',function (err, reply) {
        res.send(reply);
    })
})


function getAllData(res) {
    client.get('allData',function (err, reply) {
        console.log(reply);
        res.send(reply);
    })
}


var server = app.listen(3000,function () {
    console.log('server running at http://127.0.0.1:3000');
})