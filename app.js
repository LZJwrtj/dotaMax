var express = require("express");
var redis = require('redis');
var path = require('path');
var cors = require('cors');
var fs = require('fs');
var htmlfile = fs.readFileSync('./views/index.html');


/**/
var client = redis.createClient();

var app = express();
var port = process.argv[2] || 3000;

app.use(express.static(path.join(__dirname, '../server')));
app.use(cors({
    origin: ['http://localhost:8080'],
    methods: ['GET', 'POST'],
    // alloweHeaders:['Conten-Type', 'Authorization']
}));

app.get('/', function (req, res) {
    res.setHeader('content-type', 'text/html');
    res.send(htmlfile);
//    res.sendfile('views/index.html');
    /*var data = {
        "shop": [
            {
                "ID": "1",
                "cost": 220000,
                "img_url": "../public/img/hero1.png",
                "name": "\u566c\u9b54\u4e4b\u738b",
                "qualityColor": "#CF6A32",
                "qualityName": "\u94ed\u523b"
            },
            {
                "ID": "2",
                "cost": 220000,
                "img_url": "../public/img/hero2.png",
                "name": "\u566c\u9b54\u4e4b\u738b",
                "qualityColor": "#D2D2D2",
                "qualityName": "\u6807\u51c6"
            },
            {
                "ID": "3",
                "cost": 220000,
                "img_url": "../public/img/hero3.png",
                "name": "\u5fc3\u6e0a\u9b54\u89d2",
                "qualityColor": "#CF6A32",
                "qualityName": "\u94ed\u523b"
            },
            {
                "ID": "4",
                "cost": 220000,
                "img_url": "../public/img/hero4.png",
                "name": "\u5fc3\u6e0a\u9b54\u89d2",
                "qualityColor": "#D2D2D2",
                "qualityName": "\u6807\u51c6"
            },
            {
                "ID": "5",
                "cost": 180000,
                "img_url": "../public/img/hero5.png",
                "name": "\u64ce\u5929\u5927\u5723",
                "qualityColor": "#CCCCCC",
                "qualityName": "\u5c0a\u4eab"
            },
            {
                "ID": "6",
                "cost": 1900000,
                "img_url": "http://cdn.maxjia.com/econ_items/4007_265049.png",
                "name": "\u9f99\u722a\u5f2f\u94a9",
                "qualityColor": "#D2D2D2",
                "qualityName": "\u6807\u51c6"
            },
            {
                "ID": "7",
                "cost": 185000,
                "img_url": "http://cdn.maxjia.com/econ_items/9050_563965.png",
                "name": "\u64ce\u5929\u5927\u5723",
                "qualityColor": "#CCCCCC",
                "qualityName": "\u5c0a\u4eab"
            },
            {
                "ID": "8",
                "cost": 185000,
                "img_url": "http://cdn.maxjia.com/econ_items/7385_553610.png",
                "name": "\u574d\u96ea\u5bd2\u88d8",
                "qualityColor": "#CCCCCC",
                "qualityName": "\u5c0a\u4eab"
            },
            {
                "ID": "9",
                "cost": 200000,
                "img_url": "http://cdn.maxjia.com/econ_items/7385_553610.png",
                "name": "\u574d\u96ea\u5bd2\u88d8",
                "qualityColor": "#D2D2D2",
                "qualityName": "\u6807\u51c6"
            },
            {
                "ID": "10",
                "cost": 170000,
                "img_url": "http://cdn.maxjia.com/econ_items/6914_991498.png",
                "name": "\u96f7\u9706\u795e\u76d4",
                "qualityColor": "#CCCCCC",
                "qualityName": "\u5c0a\u4eab"
            }
        ]
    }
     client.set('allShop',JSON.stringify(data),redis.print)
     client.get('allShop',redis.print)*/
})
app.get('/server', function (req, res) {
    res.sendfile('server/index.html');
})
app.get('/dotaMax-api/getAllData', function (req, res) {
    getAllData('allData').then(function (reply) {
        // console.log(reply);
        res.send(reply);
    });
})
//获取直播列表
app.get('/dotaMax-api/getLiveData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    new Promise(function (resolve, reject) {
        getAllData('allLive').then(function (reply) {
            // console.log(reply);
            // res.send(reply);
            if (!reply) {
                reject('get noting!')
            } else {
                resolve(reply)
            }
            return reply;
        })
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
            status: 100,
            des: err,
        })
    })
})

//修改直播数据
app.get('/dotaMax-api/modifyLiveData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // console.log(req.query);
    var liveData_ID = req.query.liveData_ID;
    var liveData_src = req.query.liveData_src;
    var liveData_name = req.query.liveData_name;
    var liveData_title = req.query.liveData_title;
    var liveData_watchNum = req.query.liveData_watchNum;
    var liveData_platform = req.query.liveData_platform;
    new Promise(function (resolve, reject) {
        if (!liveData_ID) {
            reject('no liveData_ID');
        }
        getAllData('allLive').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            } else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        // console.log(reply);
        reply = JSON.parse(reply);
        // console.log(reply)
        // console.log(reply.live);
        reply.live.forEach(function (item) {
            if (item.ID == liveData_ID) {
                item.src = liveData_src;
                item.title = liveData_title;
                item.name = liveData_name;
                item.watchNum = liveData_watchNum;
                item.platform = liveData_platform;
            }
        })
        return reply;
    }).then(function (reply) {
        return setAllData('allLive', reply)
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '修改成功'
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            desc: err
        })
    })
})

//删除直播数据
app.get('/dotaMax-api/delLiveData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var liveData_ID = req.query.ID;
    new Promise(function (resolve, reject) {
        if (!liveData_ID) {
            reject('no liveData_ID')
        }
        getAllData('allLive').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            } else {
                resolve(reply)
            }
            return reply;
        })

    }).then(function (reply) {
        reply = JSON.parse(reply);
        reply.live = reply.live.filter(function (item) {
            return item.ID != liveData_ID;
        })
        return reply
    }).then(function (reply) {
        // console.log(reply);
        setAllData('allLive', reply);
        return reply
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '删除成功',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//增加直播
app.get('/dotaMax-api/addLiveData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var newLIve = {}
    newLIve.ID = req.query.add_ID;
    newLIve.src = req.query.add_src;
    newLIve.title = req.query.add_title;
    newLIve.name = req.query.add_name;
    newLIve.watchNum = req.query.add_watchNum;
    newLIve.platform = req.query.add_platform;
    new Promise(function (resolve, reject) {
        if (!newLIve.ID) {
            reject('no add_ID!')
        }
        getAllData('allLive').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            } else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        reply.live.push(newLIve);
        return reply;
    }).then(function (reply) {
        setAllData('allLive', reply)
        return reply
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '添加成功',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//获取商店列表
app.get('/dotaMax-api/getShopData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    new Promise(function (resolve, reject) {
        getAllData('allShop').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            } else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        return reply;
    }).then(function (reply) {
        res.json({
            status: 200,
            des: 'success',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//修改商店列表
app.get('/dotaMax-api/modifyShopData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(req.query);
    var newShop = {};
    newShop.ID = req.query.shopData_ID;
    newShop.imgUrl = req.query.shopData_imgUrl;
    newShop.cost = req.query.shopData_cost;
    newShop.qualityName = req.query.shopData_qualityName;
    newShop.qualityColor = req.query.shopData_qualityColor;
    newShop.name = req.query.shopData_name;
    new Promise(function (resolve, reject) {
        if (!newShop.ID) {
            reject('no shopData_ID')
        }
        getAllData('allShop').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            } else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        reply.shop.forEach(function (item) {
            if (item.ID == newShop.ID) {
                item.img_url = newShop.imgUrl;
                item.cost = newShop.cost;
                item.qualityName = newShop.qualityName;
                item.qualityColor = newShop.qualityColor;
                item.name = newShop.name;
            }
        })
        return reply;
    }).then(function (reply) {
        return setAllData('allShop', reply);
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '修改成功'
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })

})

//删除商店列表
app.get('/dotaMax-api/delShopData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(req.query)
    var shopData_ID = req.query.ID;
    new Promise(function (resolve, reject) {
        if (!shopData_ID) {
            reject('no shopData_ID!')
        }
        getAllData('allShop').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            } else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        reply.shop = reply.shop.filter(function (item) {
            return item.ID != shopData_ID
        })
        return reply;
    }).then(function (reply) {
        setAllData('allShop', reply)
        return reply;
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '删除成功',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//添加商店列表
app.get('/dotaMax-api/addShopData',function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var newShop = {};
    newShop.ID = req.query.add_ID;
    newShop.img_url = req.query.add_imgUrl;
    newShop.cost = req.query.add_cost;
    newShop.qualityName = req.query.add_qualityName;
    newShop.qualityColor = req.query.add_qualityColor;
    newShop.name = req.query.add_name;
    new Promise(function (resolve, rejcet) {
        if (!newShop.ID) {
            rejcet('no newShop_ID!')
        }
        getAllData('allShop').then(function (reply) {
            reply = JSON.parse(reply);
            reply.shop.push(newShop);
            return reply
        })
    }).then(function (reply) {
        setAllData('allShop',reply);
        return reply;
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '增加成功',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//获取比赛列表
app.get('/dotaMax-api/getMatchData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(req.query);
    new Promise(function (resolve, reject) {
        getAllData('allMatch').then(function (reply) {
            if (!reply) {
                reject('get nothing!');
            } else {
                resolve(reply)
            }
            return reply;
        })
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
            status: 100,
            des: err
        })
    })
})

//修改比赛数据
app.get('/dotaMax-api/modifyMatchData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // console.log(req.query);
    var matchData_ID = req.query.matchData_ID;
    var matchData_src1 = req.query.matchData_src1;
    var matchData_src2 = req.query.matchData_src2;
    var matchData_team1 = req.query.matchData_team1;
    var matchData_team2 = req.query.matchData_team2;
    var matchData_time = req.query.matchData_time;
    new Promise(function (resolve, reject) {
        if (!matchData_ID) {
            reject('no matchData_ID!')
        }
        getAllData('allMatch').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            } else {
                resolve(reply)
            }
            console.log(reply)
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        console.log(reply)
        reply.matchs.forEach(function (item) {
            if (item.ID == matchData_ID) {
                item.country_src1 = matchData_src1;
                item.country_src2 = matchData_src2;
                item.team1 = matchData_team1;
                item.team2 = matchData_team2;
                item.time = matchData_time;
            }
        })
        return reply;
    }).then(function (reply) {
        return setAllData('allMatch', reply)
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '修改成功'
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//删除比赛数据
app.get('/dotaMax-api/delMatchData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var matchData_ID = req.query.ID;
    new Promise(function (resolve, reject) {
        if (!matchData_ID) {
            reject('no matchData_ID!')
        }
        getAllData('allMatch').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            } else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        reply.matchs = reply.matchs.filter(function (item) {
            return item.ID != matchData_ID
        })
        return reply;
    }).then(function (reply) {
        console.log(reply);
        setAllData('allMatch', reply);
        return reply;
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '删除成功',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//增加比赛
app.get('/dotaMax-api/addMatchData', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(req.query);
    var newMatch = {};
    newMatch.ID = req.query.add_ID;
    newMatch.country_src1 = req.query.add_country_src1;
    newMatch.country_src2 = req.query.add_country_src2;
    newMatch.team1 = req.query.add_team1;
    newMatch.team2 = req.query.add_team2;
    newMatch.time = req.query.add_time;
    new Promise(function (resolve, reject) {
        if (!newMatch.ID) {
            reject('no add_ID!')
        }
        getAllData('allMatch').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            } else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        reply.matchs.push(newMatch);
        console.log(reply);
        return reply;
    }).then(function (reply) {
        setAllData('allMatch', reply);
        return reply;
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '增加成功',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//获取战队排名
app.get('/dotaMax-api/getRankData',function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    new Promise(function (resolve, reject) {
        getAllData('allRank').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            }else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        return reply;
    }).then(function (reply) {
        res.json({
            status: 200,
            des: 'success',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })

})

//修改战队排名
app.get('/dotaMax-api/modifyRankData',function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var rankData_ID = req.query.rankData_ID;
    var rankData_num = req.query.rankData_num;
    var rankData_country = req.query.rankData_country;
    var rankData_team = req.query.rankData_team;
    var rankData_MMR = req.query.rankData_MMR;
    new  Promise(function (resolve, reject) {
        if (!rankData_ID) {
            reject('no rankData_ID!')
        }
        getAllData('allRank').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            }else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        reply.rank.forEach(function (item) {
            if (item.ID == rankData_ID) {
                item.num = rankData_num;
                item.country = rankData_country;
                item.team = rankData_team;
                item.MMR = rankData_MMR;
            }
        })
        return reply;
    }).then(function (reply) {
        return setAllData('allRank',reply);
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '修改成功'
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//删除战队排名
app.get('/dotaMax-api/delRankData',function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var rankData_ID = req.query.ID;
    new Promise(function (resolve, reject) {
        if (!rankData_ID) {
            reject('no rankData_ID')
        }
        getAllData('allRank').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            }else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        reply.rank = reply.rank.filter(function (item) {
            return item.ID != rankData_ID
        })
        return reply;
    }).then(function (reply) {
        setAllData('allRank',reply);
        return reply;
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '删除成功',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//增加战队排名
app.get('/dotaMax-api/addRankData',function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var newRank = {};
    newRank.ID = req.query.add_ID;
    newRank.num = req.query.add_num;
    newRank.country = req.query.add_country;
    newRank.team = req.query.add_team;
    newRank.MMR = req.query.add_MMR;
    new Promise(function (resolve, reject) {
        if (!newRank.ID) {
            reject('no newRank.ID!')
        }
        getAllData('allRank').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            }else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        reply.rank.push(newRank);
        return reply;
    }).then(function (reply) {
        setAllData('allRank',reply);
        return reply;
    }).then(function (reply) {
        res.json({
            status: 200,
            des: '增加成功',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//获取赛事列表
app.get('/dotaMax-api/getLeagueData',function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    new Promise(function (resolve, reject) {
        getAllData('allLeague').then(function (reply) {
            if (!reply) {
                reject('get nothing!')
            }else {
                resolve(reply)
            }
            return reply;
        })
    }).then(function (reply) {
        reply = JSON.parse(reply);
        return reply;
    }).then(function (reply) {
        res.json({
            status: 200,
            des: 'success',
            data: reply
        })
    }).catch(function (err) {
        res.json({
            status: 100,
            des: err
        })
    })
})

//获得数据
function getAllData(key) {
    return new Promise(function (resolve, reject) {
        client.get(key, function (err, reply) {
            if (err) {
                reject(err)
            } else {
                resolve(reply);
            }
        })
    })
}

//设置数据
function setAllData(key, val) {
    return new Promise(function (resolve, reject) {
        if (typeof val == 'object') {
            resolve(client.set(key, JSON.stringify(val)))
        }
    })
}

var server = app.listen(port, function () {
    console.log('server running at http://127.0.0.1:' + port);
})