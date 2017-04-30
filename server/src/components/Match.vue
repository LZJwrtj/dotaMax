<template>
    <div id="match">
        <h3 class="match_title">比赛列表</h3>
        <table class="match_list">
            <tr class="match_list_title">
                <th>ID</th>
                <th>战队国家1</th>
                <th>战队国家2</th>
                <th>战队1</th>
                <th>战队2</th>
                <th>比赛时间</th>
                <th>操作</th>
            </tr>
            <tr class="match_list_content" v-for="(match,index) in matchs">
                <!--<td>{{index+1}}</td>-->
                <td>{{match.ID}}</td>
                <td @click.stop.prevent="modify($event)">{{match.country_src1}}</td>
                <td @click.stop.prevent="modify($event)">{{match.country_src2}}</td>
                <td @click.stop.prevent="modify($event)">{{match.team1}}</td>
                <td @click.stop.prevent="modify($event)">{{match.team2}}</td>
                <td @click.stop.prevent="modify($event)">{{match.time}}</td>
                <div class="save"><input class="submit" type="submit" value="保存"></div>
                <div class="delete"><input  class="del" type="button" value="删除"></div>
            </tr>
        </table>
        <fieldset class="addMatch">
            <legend>添加直播</legend>
            <div class="form-group">
                <label for="">战队国家1:</label><br>
                <input type="text" class="form-control" v-model="newMatch.country_src1">
            </div>
            <div class="form-group">
                <label for="">战队国家2:</label><br>
                <input type="text" class="form-control" v-model="newMatch.country_src2">
            </div>
            <div class="form-group">
                <label for="">战队1:</label><br>
                <input type="text" class="form-control" v-model="newMatch.team1">
            </div>
            <div class="form-group">
                <label for="">战队2:</label><br>
                <input type="text" class="form-control" v-model="newMatch.team2">
            </div>
            <div class="form-group">
                <label for="">比赛时间:</label><br>
                <input type="text" class="form-control" v-model="newMatch.time">
            </div>
            <button @click="addMatch" class="add">添加比赛</button>
        </fieldset>
    </div>
</template>

<script type="text/ecmascript-6">
    //    import Tabledit from '../assets/js/jquery.tabledit.js'
    export default {
        data() {
            return {
                matchs:[],
                newMatch:{
                    ID: '',
                    country_src1: '',
                    country_src2: '',
                    team1: '',
                    team2: '',
                    time: ''
                }
            }
        },
        created() {
            this.$http.get('http://localhost:3000/dotaMax-api/getMatchData',{
                headers: {
                    "Conten-Type":"http://localhost:3000/dotaMax-api/getMatchData"
                }
            }).then(function (res) {
                this.matchs = res.data.data.matchs;
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
                                url: 'http://localhost:3000/dotaMax-api/modifyMatchData',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    matchData_ID: arr[0],
                                    matchData_src1: arr[1],
                                    matchData_src2: arr[2],
                                    matchData_team1: arr[3],
                                    matchData_team2: arr[4],
                                    matchData_time: arr[5]
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
                                url: 'http://localhost:3000/dotaMax-api/delMatchData',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    ID: ID
                                },
                                success: function (res) {
                                    that.matchs = res.data.matchs;
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
            addMatch() {
                this.newMatch.ID = this.matchs.length+1;
                this.matchs.push(this.newMatch);
                var that = this;
                $.ajax({
                    url: 'http://localhost:3000/dotaMax-api/addMatchData',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        add_ID: this.newMatch.ID,
                        add_country_src1: this.newMatch.country_src1,
                        add_country_src2: this.newMatch.country_src2,
                        add_team1: this.newMatch.team1,
                        add_team2: this.newMatch.team2,
                        add_time: this.newMatch.time
                    },
                    success: function (res) {
                        console.log(res)
                        that.matchs = res.data.matchs;
                    }
                })
                this.newMatch.ID = '';
                this.newMatch.country_src1 = '';
                this.newMatch.country_src2 = '';
                this.newMatch.team1 = '';
                this.newMatch.team2 = '';
                this.newMatch.time = '';
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    table, th, td {
        border: 1px solid #cccccc;
        /*border-collapse: collapse;*/
    }
    .match_title{
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 20px;
        margin-top: 30px;
    }
    .match_list {
        width: 80%;
        background: rgba(7, 167, 189, 0.43);
        margin: 20px auto 0;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        .match_list_title {
            height: 30px;
            line-height: 30px;
            font-size: 18px;
        }
        .match_list_content {
            height: 25px;
            line-height: 25px;
            font-size: 14px;
            text-align: center;
            cursor: pointer;
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
    .addMatch{
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
