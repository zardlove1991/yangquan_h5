import { createApp } from 'vue'
import Detail from './views/Detail.vue'
import { vant } from '@/config/vant.config'
import "amfe-flexible"
import Vconsole from 'vconsole'
titleNode.innerHTML = new URLSearchParams(location.search).get("title");
let vConsole
~location.search.indexOf('debug') &&  (vConsole = new Vconsole())

const app = createApp(Detail)
vant(app)
app
    .mount('#detail')