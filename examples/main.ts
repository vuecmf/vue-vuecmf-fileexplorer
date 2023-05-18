import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import VuecmfFileexplorer from "../packages/index"

createApp(App).use(VuecmfFileexplorer).mount('#app')

