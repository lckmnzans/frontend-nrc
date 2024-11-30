import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from './views/DashboardView.vue';
import ResetView from './views/ResetView.vue';
import LoginV from './components/Login.vue';
import ForgotV from './components/Forgot.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {   path:'/login',
            component: LoginV
        },
        {   path:'/forgot-password',
            component: ForgotV
        },
        {   path:'/reset-password',
            component: ResetView,
            props: (route) => ({ token: route.query.token })
        },
        {   path:'/',
            component: DashboardView,
            alias: '/dashboard',
            children: [
                {   path: 'home',
                    component: () => import('./views/main/HomeView.vue')
                },
                {   path: 'category',
                    component: () => import('./views/main/CategoryView.vue')
                },
                {   path: 'accounts',
                    component: () => import('./views/main/AccountsView.vue')
                },
                {   path: 'settings',
                    component: () => import('./views/main/SettingsView.vue')
                }
            ]
        }
    ]
})

export default router;