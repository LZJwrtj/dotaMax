## dotaMax
> vue、vue-router、vue-resource、nodejs、express、redis、webpack 

### 简介

> 自己学习nodejs也有段时间了，所以就想尝试着写一个简单的后台管理系统。由于自己比较喜欢看直播比赛，所以自己就从dotamax下手。当node服务器检测到来自前端的增加、删除或者修改的请求时候会从redis里面把存储的数据取出来并做相应的处理再发送到前端，渲染到前端页面，并且再把处理好的数据重新的存储到redis当中去！

### 流程图

![预览](https://github.com/LZJwrtj/dotaMax/blob/master/public/img/flowsheet.png)

### 后台运行

```shell
npm install
npm app
```

### 后台管理页面运行

进入server文件夹

```shell
npm install
npm run dev
```
