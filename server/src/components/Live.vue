<template>
    <div id="live">
        <h3 class="live_title">直播列表</h3>
        <table class="live_list">
            <tr class="live_list_title">
                <th>ID</th>
                <th>首页</th>
                <th>名称</th>
                <th>标题</th>
                <th>观看人数</th>
                <th>直播平台</th>
                <th>操作</th>
            </tr>
            <tr class="live_list_content" v-for="(live,index) in lives">
                <!--<td>{{index+1}}</td>-->
                <td>{{live.ID}}</td>
                <td @click.stop.prevent="modify($event)">{{live.src}}</td>
                <td @click.stop.prevent="modify($event)">{{live.name}}</td>
                <td @click.stop.prevent="modify($event)">{{live.title}}</td>
                <td @click.stop.prevent="modify($event)">{{live.watchNum}}</td>
                <td @click.stop.prevent="modify($event)">{{live.platform}}</td>
                <div class="save"><input class="submit" type="submit" value="保存"></div>
                <div class="delete"><input  class="del" type="button" value="删除"></div>
            </tr>
        </table>
        <fieldset class="addLive">
            <legend>添加直播</legend>
            <div class="form-group">
                <label for="">首页:</label><br>
                <input type="text" class="form-control" v-model="newLive.src">
            </div>
            <div class="form-group">
                <label for="">名称:</label><br>
                <input type="text" class="form-control" v-model="newLive.name">
            </div>
            <div class="form-group">
                <label for="">标题:</label><br>
                <input type="text" class="form-control" v-model="newLive.title">
            </div>
            <div class="form-group">
                <label for="">观看人数:</label><br>
                <input type="text" class="form-control" v-model="newLive.watchNum">
            </div>
            <div class="form-group">
                <label for="">直播平台:</label><br>
                <input type="text" class="form-control" v-model="newLive.platform">
            </div>
            <button @click="addLive" class="add">添加直播</button>
        </fieldset>
    </div>
</template>

<script type="text/ecmascript-6">
//    import Tabledit from '../assets/js/jquery.tabledit.js'
    export default {
        data() {
            return {
                lives:[],
                newLive:{
                    ID: '',
                    src: '',
                    name: '',
                    title: '',
                    watchNum: '',
                    platform: ''
                }
            }
        },
        created() {
            this.$http.get('http://localhost:3000/dotaMax-api/getLiveData',{
                headers: {
                    "Conten-Type":"http://localhost:3000/dotaMax-api/getLiveData"
                }
            }).then(function (res) {
                this.lives = res.data.data.live;
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
                                url: 'http://localhost:3000/dotaMax-api/modifyLiveData',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    liveData_ID: arr[0],
                                    liveData_src: arr[1],
                                    liveData_name: arr[2],
                                    liveData_title: arr[3],
                                    liveData_watchNum: arr[4],
                                    liveData_platform: arr[5]
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
                               url: 'http://localhost:3000/dotaMax-api/delLiveData',
                               type: 'GET',
                               dataType: 'json',
                               data: {
                                   ID: ID
                               },
                               success: function (res) {
                                    that.lives = res.data.live;
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
            addLive() {
                this.newLive.ID = this.lives.length+1;
                this.lives.push(this.newLive);
                var that = this;
                $.ajax({
                    url: 'http://localhost:3000/dotaMax-api/addLiveData',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        add_ID: this.newLive.ID,
                        add_src:this.newLive.src,
                        add_name:this.newLive.name,
                        add_title:this.newLive.title,
                        add_watchNum:this.newLive.watchNum,
                        add_platform:this.newLive.platform
                    },
                    success: function (res) {
                        console.log(res)
                        that.lives = res.data.live;
                    }
                })
                this.newLive.ID = '';
                this.newLive.src = '';
                this.newLive.title = '';
                this.newLive.name = '';
                this.newLive.watchNum = '';
                this.newLive.platform = '';
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    table, th, td {
        border: 1px solid #cccccc;
        /*border-collapse: collapse;*/
    }
    .live_title{
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 20px;
        margin-top: 30px;
    }
    .live_list {
        width: 80%;
        background: rgba(7, 167, 189, 0.43);
        margin: 20px auto 0;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        .live_list_title {
            height: 30px;
            line-height: 30px;
            font-size: 18px;
        }
        .live_list_content {
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
    .addLive{
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
