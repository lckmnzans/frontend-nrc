import { createApp } from 'vue';
import App from './App.vue';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { createPinia } from 'pinia';
import router from './router';
import $auth from './utils/auth';

import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.provide('$auth', $auth);

app.use(VueAxios, axios);

app.mount('#app');
