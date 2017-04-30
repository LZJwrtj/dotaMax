import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import $ from 'jquery'
import Tabledit from 'jquery-tabledit'
import App from './App.vue'
import routerConfig from './router.config.js'
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use($)
Vue.use(Tabledit)

const router = new VueRouter(routerConfig)

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
router.push('/live')