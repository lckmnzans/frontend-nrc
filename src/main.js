import { createApp } from 'vue'
import App from './App.vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import router from './router';
import $auth from './utils/auth';

import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp(App);
library.add(faEye, faEyeSlash);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);

app.provide('$auth', $auth);

app.use(VueAxios, axios)
app.provide('$axios', app.config.globalProperties.axios);

app.mount('#app');
