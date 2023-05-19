import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import VuecmfFileexplorer from "../packages/index"
import "bootstrap-icons/font/bootstrap-icons.css"

createApp(App).use(VuecmfFileexplorer).mount('#app')

