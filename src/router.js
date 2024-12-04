import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from './views/DashboardView.vue';
import ResetView from './views/ResetView.vue';
import LoginV from './components/Login.vue';
import ForgotV from './components/Forgot.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {   name: 'login',
            path: '/login',
            component: LoginV
        },
        {   name: 'forgot-password',
            path: '/forgot-password',
            component: ForgotV
        },
        {   name: 'reset-password',
            path: '/reset-password',
            component: ResetView,
            props: (route) => ({ token: route.query.token })
        },
        {   path: '/',
            component: DashboardView,
            children: [
                {   name: 'home',
                    path: '',
                    component: () => import('./views/main/HomeView.vue'),
                    alias: 'dashboard'
                },
                {   name: 'category',
                    path: 'category',
                    component: () => import('./views/main/CategoryView.vue'),
                    children: [
                        {   path: 'subcat1',
                            component: () => import('./views/main/category/category1.vue')
                        },
                        {   path: 'subcat2',
                            component: () => import('./views/main/category/category2.vue')
                        }
                    ]
                },
                {   path: 'accounts',
                    component: () => import('./views/main/AccountsView.vue'),
                    children: [
                        {   path: '',
                            component: () => import('./views/main/account/ListAccountView.vue')
                        },
                        {   path: 'create',
                            component: () => import('./views/main/account/CreateAccountView.vue')
                        }
                    ]
                },
                {   name: 'settings',
                    path: 'settings',
                    component: () => import('./views/main/SettingsView.vue')
                }
            ]
        }
    ]
})

export default router;