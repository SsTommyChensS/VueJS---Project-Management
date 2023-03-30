import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'
import store from './store'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'


//Set auth header
axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;

createApp(App).use(router).use(store).mount('#app')
