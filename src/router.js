import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from './views/DashboardView.vue';
import ResetView from './views/ResetPasswordView.vue';
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
                {   path: 'profile',
                    component: () => import('./views/main/ProfileView.vue'),
                    children: [
                        {   name: 'your-profile',
                            path: '',
                            component: () => import('./views/main/YourProfileView.vue')
                        },      
                        {   name: 'change-password',
                            path: 'change-password',
                            component: () => import('./views/ChangePasswordView.vue')
                        }
                    ]
                },
                {   name: 'home',
                    path: '',
                    component: () => import('./views/main/HomeView.vue'),
                    alias: 'dashboard'
                },
                {   name: 'category',
                    path: 'category',
                    component: () => import('./views/main/CategoryView.vue'),
                    children: [
                        {   path: ':page',
                            component: () => import('./views/main/PageCategory.vue'),
                            props: true
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
                }
            ]
        }
    ]
})

export default router;