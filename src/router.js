import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import LoginV from './components/Login.vue';
import ForgotV from './components/Forgot.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {   path:'/',
            component: DashboardView,
            alias: '/dashboard'
        },
        {   path:'/login',
            component: LoginV
        },
        {   path:'/forgot-password',
            component: ForgotV
        },
    ]
})

export default router;