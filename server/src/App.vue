<template>
    <div id="app">
        <div class="nav-wrapper">
            <h2 class="title">后台管理</h2>
            <ul class="nav">
                <li>
                    <router-link to="/live">直播信息</router-link>
                </li>
                <li>
                    <router-link to="/shop">商城列表</router-link>
                </li>
                <li>
                    <router-link to="/match">比赛信息</router-link>
                </li>
                <li>
                    <router-link to="/team">战队排行</router-link>
                </li>
            </ul>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "./assets/css/base.css";

    body {
        background: #ccc;
    }

    .nav-wrapper {
        position: absolute;
        top: 5px;
        bottom: 5px;
        left: 0;
        width: 150px;
        min-height: 400px;

        color: #ffffff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        background: #333;
        .title {
            height: 50px;
            line-height: 50px;
            text-align: center;
            border-bottom: 1px solid #000000;
        }
        .nav {
            width: 100%;
            text-align: center;
            margin-top: 20px;
            li {
                height: 50px;
                line-height: 50px;
                font-size: 20px;
                border-bottom: 1px solid #000000;
                a{
                    display: block;
                    height: 50px;
                    line-height: 50px;
                    color: #ffffff;
                    &.router-link-active{
                        color: #f46;
                    }
                }
                &:hover a{
                    color: #f46;
                }
            }
        }
    }

    .content {
        position: absolute;
        top: 5px;
        bottom: 5px;
        left: 150px;
        right: 0;
        min-height: 400px;
    }
</style>
