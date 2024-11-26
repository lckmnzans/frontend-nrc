import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import DashboardView from './views/DashboardView.vue';
import ResetView from './views/ResetView.vue';
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
        {   path:'/reset-password',
            component: ResetView,
            props: (route) => ({ token: route.query.token })
        }
    ]
})

export default router;