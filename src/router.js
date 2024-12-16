import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import ResetView from '@/views/ResetPasswordView.vue';
import LoginV from '@/components/Login.vue';
import ForgotV from '@/components/Forgot.vue';
import TabV from '@/views/main/category/PageCategory.vue';

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
                    component: () => import('@/views/main/profile/ProfileView.vue'),
                    children: [
                        {   name: 'your-profile',
                            path: '',
                            component: () => import('@/views/main/profile/YourProfileView.vue')
                        },      
                        {   name: 'change-password',
                            path: 'change-password',
                            component: () => import('@/views/main/profile/ChangePasswordView.vue')
                        }
                    ]
                },
                {   name: 'home',
                    path: '',
                    component: () => import('@/views/main/HomeView.vue'),
                    alias: 'dashboard'
                },
                {   name: 'category',
                    path: 'category',
                    children: [
                        {   path: '1',
                            component: () => import('@/views/main/category/Category1View.vue'),
                            children: [
                                {   path: '',
                                    redirect: '/category/1/A01',
                                },
                                {   path: 'A01',
                                    component: TabV,
                                    props: { tabName: 'Legalitas'}
                                },
                                {   path: 'A02',
                                    component: TabV,
                                    props: { tabName: 'Kontrak'}
                                },
                                {   path: 'A03',
                                    component: TabV,
                                    props: { tabName: 'Tenaga Ahli'}
                                },
                                {   path: 'A04',
                                    component: TabV,
                                    props: { tabName: 'CV'}
                                },
                                {   path: 'A05',
                                    component: TabV,
                                    props: { tabName: 'Keuangan'}
                                },
                                {   path: 'A06',
                                    component: TabV,
                                    props: { tabName: 'Proyek'}
                                },
                                {   path: 'A07',
                                    component: TabV,
                                    props: { tabName: 'Pengurus'}
                                },
                                {   path: 'A08',
                                    component: TabV,
                                    props: { tabName: 'Pemegang Saham'}
                                },
                                {   path: 'A09',
                                    component: TabV,
                                    props: { tabName: 'Peralatan'}
                                },
                                {   path: 'A10',
                                    component: TabV,
                                    props: { tabName: 'Lain-lain'}
                                }
                            ]
                        },
                        {   path: '2',
                            component: () => import('@/views/main/category/Category2View.vue'),
                            children: [
                                {   path: '',
                                    redirect: '/category/2/B01'
                                },
                                {   path: 'B01',
                                    component: () => import('@/views/main/category/forms/FormB01View.vue')
                                },
                                {   path: 'B02',
                                    component: TabV,
                                    props: { tabName: 'Surat Keluar'}
                                }
                            ]
                        },
                        {   path: '3',
                            component: () => import('@/views/main/category/Category3View.vue'),
                            children: [
                                {   path: '',
                                    redirect: '/category/3/C01'
                                },
                                {   path: 'C01',
                                    component: TabV,
                                    props: { tabName: 'Sertifikat'}
                                },
                                {   path: 'C02',
                                    component: TabV,
                                    props: { tabName: 'SPJB'}
                                },
                            ]
                        }
                    ]
                },
                {   path: 'accounts',
                    component: () => import('@/views/main/account/AccountsView.vue'),
                    children: [
                        {   path: '',
                            component: () => import('@/views/main/account/ListAccountView.vue')
                        },
                        {   path: 'create',
                            component: () => import('@/views/main/account/CreateAccountView.vue')
                        }
                    ]
                }
            ]
        }
    ]
})

export default router;