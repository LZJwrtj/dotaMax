$(function () {
    new Vue({
        el: '#main',
        data: {
            lives: [],
            shops: [],
            leagues: [],
            matchs: [],
            ranks: []
        },
        created: function () {
            /*this.$http.get('dotaMax-api/getAllData').then(function (res) {

                this.leagues = res.data.league;

            },function (res) {
                console.log(res.status)
            })*/

            //获取直播列表
            this.$http.get('dotaMax-api/getLiveData').then(function (res) {
                console.log(res.data.data.live);
                this.lives = res.data.data.live;
            },function (res) {
                console.log(res.status)
            })

            //获取比赛列表
            this.$http.get('dotaMax-api/getMatchData').then(function (res) {
                this.matchs = res.data.data.matchs;
            },function (res) {
                console.log(res.status)
            })

            //获取商店列表
            this.$http.get('dotaMax-api/getShopData').then(function (res) {
                this.shops = res.data.data.shop;
            },function (res) {
                console.log(res.status)
            })

            //获取战队排名
            this.$http.get('dotaMax-api/getRankData').then(function (res) {
                this.ranks = res.data.data.rank
            },function (res) {
                console.log(res.status)
            })

            //获取赛事列表
            this.$http.get('dotaMax-api/getLeagueData').then(function (res) {
                this.leagues = res.data.data.league
            },function (res) {
                console.log(res.status)
            })
        }
    })
})
$(function () {
    //点击回到顶部
    $('.top').click(function () {
        $('body').animate({scrollTop: 0}, 500)
    })
})