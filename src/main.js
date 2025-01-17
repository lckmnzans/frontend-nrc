import { createApp } from 'vue';
import App from './App.vue';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router';
import $auth from './utils/auth';

import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

app.provide('$auth', $auth);

app.use(VueAxios, axios);

app.mount('#app');
