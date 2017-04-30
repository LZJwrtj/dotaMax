$(function () {
    new Vue({
        el: '#app',
        data: {
            ranks: []
        },
        created: function () {
            this.$http.get('dotaMax-api/getAllData').then(function (res) {
                console.log(res.body);
                this.ranks = res.body.rank;
            },function (res) {
                console.log(res.status)
            })
        }
    })
})