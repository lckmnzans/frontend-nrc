import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginV from './components/Login.vue';
import ForgotV from './components/Forgot.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {   path:'/',
            component: HomeView
        },
        {   path:'/login',
            component: LoginV
        },
        {   path:'/forgot-password',
            component: ForgotV
        }
    ]
})

export default router;