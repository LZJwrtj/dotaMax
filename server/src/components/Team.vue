<template>
    <div id="team">
        <h3 class="team_title">战队排名</h3>
        <table class="team_list">
            <tr class="team_list_title">
                <th>ID</th>
                <th>战队排名</th>
                <th>战队国家</th>
                <th>战队</th>
                <th>MMR</th>
                <th>操作</th>
            </tr>
            <tr class="team_list_content" v-for="(rank,index) in ranks">
                <!--<td>{{index+1}}</td>-->
                <td>{{rank.ID}}</td>
                <td @click.stop.prevent="modify($event)">{{rank.num}}</td>
                <td @click.stop.prevent="modify($event)">{{rank.country}}</td>
                <td @click.stop.prevent="modify($event)">{{rank.team}}</td>
                <td @click.stop.prevent="modify($event)">{{rank.MMR}}</td>
                <div class="save"><input class="submit" type="submit" value="保存"></div>
                <div class="delete"><input  class="del" type="button" value="删除"></div>
            </tr>
        </table>
        <fieldset class="addTeam">
            <legend>添加战队</legend>
            <div class="form-group">
                <label for="">战队排名:</label><br>
                <input type="text" class="form-control" v-model="newRank.num">
            </div>
            <div class="form-group">
                <label for="">战队国家:</label><br>
                <input type="text" class="form-control" v-model="newRank.country">
            </div>
            <div class="form-group">
                <label for="">战队:</label><br>
                <input type="text" class="form-control" v-model="newRank.team">
            </div>
            <div class="form-group">
                <label for="">MMR:</label><br>
                <input type="text" class="form-control" v-model="newRank.MMR">
            </div>
            <!--<div class="form-group">
                <label for="">英雄名称:</label><br>
                <input type="text" class="form-control" v-model="newTeam.name">
            </div>-->
            <button @click="addTeam" class="add">添加战队</button>
        </fieldset>
    </div>
</template>

<script type="text/ecmascript-6">
    //    import Tabledit from '../assets/js/jquery.tabledit.js'
    export default {
        data() {
            return {
                ranks:[],
                newRank:{
                    ID: '',
                    num: '',
                    country: '',
                    team: '',
                    MMR: ''
                }
            }
        },
        created() {
            this.$http.get('http://localhost:3000/dotaMax-api/getRankData',{
                headers: {
                    "Conten-Type":"http://localhost:3000/dotaMax-api/getRankData"
                }
            }).then(function (res) {
                this.ranks = res.data.data.rank;
                var that = this;
                this.$nextTick(function () {
                    $('.submit').each(function () {
                        $(this).click(function () {
                            var arr = [];
                            $(this).parent().parent().find('td').each(function () {
                                arr.push($(this).html())
                                return arr
                            })
                            $.ajax({
                                url: 'http://localhost:3000/dotaMax-api/modifyRankData',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    rankData_ID: arr[0],
                                    rankData_num: arr[1],
                                    rankData_country: arr[2],
                                    rankData_team: arr[3],
                                    rankData_MMR: arr[4]
                                },
                                success: function (res) {
                                    console.log(res.status)
                                }
                            })
                        })
                    })
                    $('.del').each(function () {
                        $(this).click(function () {
                            var ID = $(this).parent().parent().find('td').html();
                            $.ajax({
                                url: 'http://localhost:3000/dotaMax-api/delRankData',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    ID: ID
                                },
                                success: function (res) {
                                    that.ranks = res.data.rank;
                                }
                            })
                        })

                    })
                })
            }, function (res) {
                console.log(res.status)
            })
        },
        methods: {
            modify(e) {
                var text = e.target.innerHTML;
                var td = e.target;
                e.target.innerHTML = '';
                var input = $("<input>");
                input.attr('value',text);
                /*input.keyup(function(event){
                 //记牌器当前用户按下的键值
                 var myEvent= event || window.event;//获取不同浏览器中的event对象
                 var kcode =myEvent.keyCode;
                 //判断是否是回车键按下
                 if(kcode ==13){
                 var inputnode = $(this);
                 //获取当前文本框的内容
                 var inputext= inputnode.val();
                 //清空td里边的内容,然后将内容填充到里边
                 var tdNode =inputnode.parent();
                 tdNode.html(inputext);
                 }
                 });*/
                input.blur(function () {
                    var inputnode = $(this);
                    //获取当前文本框的内容
                    var inputext= inputnode.val();
                    //清空td里边的内容,然后将内容填充到里边
                    var tdNode =inputnode.parent();
                    tdNode.html(inputext);
                })
                //5，把文本框加入到td里边去
                input.appendTo(td);
                //5.5让文本框里边的文章被高亮选中
                //需要将jquery的对象转换成dom对象
                var inputdom= input.get(0);
                inputdom.select();
            },
            addTeam() {
                this.newRank.ID = this.ranks.length+1;
                this.ranks.push(this.newRank);
                var that = this;
                $.ajax({
                    url: 'http://localhost:3000/dotaMax-api/addRankData',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        add_ID: this.newRank.ID,
                        add_num: this.newRank.num,
                        add_country: this.newRank.country,
                        add_team: this.newRank.team,
                        add_MMR: this.newRank.MMR,
                    },
                    success: function (res) {
                        console.log(res)
                        that.ranks = res.data.rank;
                    }
                })
                this.newRank.ID = '';
                this.newRank.num = '';
                this.newRank.country = '';
                this.newRank.team = '';
                this.newRank.MMR = '';
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    table, th, td {
        border: 1px solid #cccccc;
        /*border-collapse: collapse;*/
    }
    .team_title{
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 20px;
        margin-top: 30px;
    }
    .team_list {
        width: 80%;
        background: rgba(7, 167, 189, 0.43);
        margin: 20px auto 0;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        .team_list_title {
            height: 30px;
            line-height: 30px;
            font-size: 18px;
        }
        .team_list_content {
            height: 25px;
            line-height: 25px;
            font-size: 14px;
            text-align: center;
            cursor: pointer;
            input{
                width: 80%;
                height: 25px;
                line-height: 25px;
            }
        }
        .save,.delete{
            height: 25px;
            line-height: 25px;
            border-top: 1px solid #cccccc;
            border-bottom: 1px solid #cccccc;

            input{
                /*border: none;*/
                width: 100%;
                height: 25px;
                line-height: 25px;
                background: none;
                cursor: pointer;
            }
        }

    }
    .addTeam{
        width: 74%;
        margin: 30px auto 0;
        padding: 30px;
        background: rgba(7, 167, 189, 0.43);
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;;
        legend{
            font-size: 18px;
            /*text-align: center;*/
            font-weight: bold;
        }
        label{
            font-size: 16px;
        }
        .form-control{
            width: 250px;
            height: 30px;
            line-height: 30px;
            margin-bottom: 10px;
            outline: none;
        }
        .add{
            padding: 5px 8px;
            font-size: 14px;
            /*margin-left: 30px;*/
            background: #ffffff;
            cursor: pointer;
            outline: none;
        }

    }
</style>
