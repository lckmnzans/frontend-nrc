import { createApp } from 'vue'
import App from './App.vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import router from './router';
import $auth from './utils/auth';

const app = createApp(App);
app.use(router);
app.provide('$auth', $auth);

app.mount('#app');
