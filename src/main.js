import { createApp } from 'vue'
import App from './views/App.vue'
import { vant } from '@/config/vant.config'
import "amfe-flexible"
import Vconsole from 'vconsole'
title1.innerHTML = import.meta.env.VITE_APP_TITLE
let vConsole
~location.search.indexOf('debug') &&  (vConsole = new Vconsole())

const app = createApp(App)
vant(app)
app
    .mount('#app')
