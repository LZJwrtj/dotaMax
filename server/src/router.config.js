import Live from './components/Live.vue'
import Match from './components/Match.vue'
import Shop from './components/Shop.vue'
import Team from './components/Team.vue'

export default {
    routes: [
        {path: '/live', component: Live},
        {path: '/match', component: Match},
        {path: '/shop', component: Shop},
        {path: '/team', component: Team},
        {path: '/', component: Live},
    ]
}