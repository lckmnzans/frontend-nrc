import { createApp } from 'vue'
import App from './App.vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import router from './router';
import $auth from './utils/auth';
import $api from './api/api';

const app = createApp(App);
app.use(router);
app.provide('$auth', $auth);
app.provide('$api', $api);

app.mount('#app');
