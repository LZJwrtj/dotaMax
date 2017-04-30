<template>
    <div id="shop">
        <h3 class="shop_title">商城列表</h3>
        <table class="shop_list">
            <tr class="shop_list_title">
                <th>ID</th>
                <th>图片链接</th>
                <th>价格</th>
                <th>英雄品阶</th>
                <th>品阶颜色</th>
                <th>英雄名称</th>
                <th>操作</th>
            </tr>
            <tr class="shop_list_content" v-for="(shop,index) in shops">
                <!--<td>{{index+1}}</td>-->
                <td>{{shop.ID}}</td>
                <td @click.stop.prevent="modify($event)">{{shop.img_url}}</td>
                <td @click.stop.prevent="modify($event)">{{shop.cost}}</td>
                <td @click.stop.prevent="modify($event)">{{shop.qualityName}}</td>
                <td @click.stop.prevent="modify($event)">{{shop.qualityColor}}</td>
                <td @click.stop.prevent="modify($event)">{{shop.name}}</td>
                <div class="save"><input class="submit" type="submit" value="保存"></div>
                <div class="delete"><input  class="del" type="button" value="删除"></div>
            </tr>
        </table>
        <fieldset class="addShop">
            <legend>添加直播</legend>
            <div class="form-group">
                <label for="">图片链接:</label><br>
                <input type="text" class="form-control" v-model="newShop.img_url">
            </div>
            <div class="form-group">
                <label for="">价格:</label><br>
                <input type="text" class="form-control" v-model="newShop.cost">
            </div>
            <div class="form-group">
                <label for="">英雄品阶:</label><br>
                <input type="text" class="form-control" v-model="newShop.qualityName">
            </div>
            <div class="form-group">
                <label for="">品阶颜色:</label><br>
                <input type="text" class="form-control" v-model="newShop.qualityColor">
            </div>
            <div class="form-group">
                <label for="">英雄名称:</label><br>
                <input type="text" class="form-control" v-model="newShop.name">
            </div>
            <button @click="addShop" class="add">添加商品</button>
        </fieldset>
    </div>
</template>

<script type="text/ecmascript-6">
    //    import Tabledit from '../assets/js/jquery.tabledit.js'
    export default {
        data() {
            return {
                shops:[],
                newShop:{
                    ID: '',
                    img_url: '',
                    cost: '',
                    qualityName: '',
                    qualityColor: '',
                    name: ''
                }
            }
        },
        created() {
            this.$http.get('http://localhost:3000/dotaMax-api/getShopData',{
                headers: {
                    "Conten-Type":"http://localhost:3000/dotaMax-api/getShopData"
                }
            }).then(function (res) {
                this.shops = res.data.data.shop;
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
                                url: 'http://localhost:3000/dotaMax-api/modifyShopData',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    shopData_ID: arr[0],
                                    shopData_imgUrl: arr[1],
                                    shopData_cost: arr[2],
                                    shopData_qualityName: arr[3],
                                    shopData_qualityColor: arr[4],
                                    shopData_name: arr[5]
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
                                url: 'http://localhost:3000/dotaMax-api/delShopData',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    ID: ID
                                },
                                success: function (res) {
                                    that.shops = res.data.shop;
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
            addShop() {
                this.newShop.ID = this.shops.length+1;
                this.shops.push(this.newShop);
                var that = this;
                $.ajax({
                    url: 'http://localhost:3000/dotaMax-api/addShopData',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        add_ID: this.newShop.ID,
                        add_imgUrl: this.newShop.img_url,
                        add_cost: this.newShop.cost,
                        add_qualityName: this.newShop.qualityName,
                        add_qualityColor: this.newShop.qualityColor,
                        add_name: this.newShop.name
                    },
                    success: function (res) {
                        console.log(res)
                        that.shops = res.data.shop;
                    }
                })
                this.newShop.ID = '';
                this.newShop.img_url = '';
                this.newShop.cost = '';
                this.newShop.qualityName = '';
                this.newShop.qualityColor = '';
                this.newShop.name = '';
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    table, th, td {
        border: 1px solid #cccccc;
        /*border-collapse: collapse;*/
    }
    .shop_title{
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 20px;
        margin-top: 30px;
    }
    .shop_list {
        width: 80%;
        background: rgba(7, 167, 189, 0.43);
        margin: 20px auto 0;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        .shop_list_title {
            height: 30px;
            line-height: 30px;
            font-size: 18px;
        }
        .shop_list_content {
            height: 25px;
            line-height: 25px;
            font-size: 14px;
            text-align: center;
            cursor: pointer;
            input{
                width: 50%;
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
    .addShop{
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
