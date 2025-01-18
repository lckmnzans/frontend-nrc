import { createRouter, createWebHistory } from 'vue-router';
import auth from './utils/auth';
import DashboardView from '@/views/DashboardView.vue';
import ResetView from '@/views/ResetPasswordView.vue';
import LoginV from '@/components/Login.vue';
import ForgotV from '@/components/Forgot.vue';
import ProfileView from '@/views/main/profile/ProfileView.vue';
import HomeView from '@/views/main/dashboard/HomeView.vue';

const router = createRouter({
    history: createWebHistory(),
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
                    component: ProfileView,
                    children: [
                        {   name: 'your-profile',
                            path: '',
                            component: () => import('@/views/main/profile/YourProfileView.vue')
                        },      
                        {   name: 'change-password',
                            path: ':username/change-password',
                            component: () => import('@/views/main/profile/ChangePasswordView.vue'),
                            props: true
                        }
                    ]
                },
                {   name: 'home',
                    alias: 'dashboard',
                    path: '',
                    component: HomeView,
                    children: [
                        {   path: '',
                            component: () => import('@/views/main/dashboard/MainDashboardView.vue')
                        },
                        {   path: 'list',
                            component: () => import('@/views/main/dashboard/DocumentListView.vue'),
                        },
                        {   path: 'edit/:docType/:docId',
                            component: () => import('@/views/main/dashboard/DocumentEditView.vue'),
                            props: true,
                        },
                        {   path: 'review/:docType/:docId',
                            component: () => import('@/views/main/dashboard/DocumentReviewView.vue'),
                            props: true
                         }
                    ]
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
                                    component: () => import('@/views/main/category/forms/FormA01View.vue')
                                },
                                {   path: 'A02',
                                    component: () => import('@/views/main/category/forms/FormA02View.vue')
                                },
                                {   path: 'A03',
                                    component: () => import('@/views/main/category/forms/FormA03View.vue')
                                },
                                {   path: 'A04',
                                    component: () => import('@/views/main/category/forms/FormA04View.vue')
                                },
                                {   path: 'A05',
                                    component: () => import('@/views/main/category/forms/FormA05View.vue')
                                },
                                {   path: 'A06',
                                    component: () => import('@/views/main/category/forms/FormA06View.vue')
                                },
                                {   path: 'A07',
                                    component: () => import('@/views/main/category/forms/FormA07View.vue')
                                },
                                {   path: 'A08',
                                    component: () => import('@/views/main/category/forms/FormA08View.vue')
                                },
                                {   path: 'A09',
                                    component: () => import('@/views/main/category/forms/FormA09View.vue')
                                },
                                {   path: 'A10',
                                    component: () => import('@/views/main/category/forms/FormA10View.vue')
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
                                    component: () => import('@/views/main/category/forms/FormB02View.vue')
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
                                    component: () => import('@/views/main/category/forms/FormC01View.vue')
                                },
                                {   path: 'C02',
                                    component: () => import('@/views/main/category/forms/FormC02View.vue')
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
                },
                {   name: 'test',
                    path: 'test',
                    component: () => import('@/views/TestView.vue')
                }
            ]
        }
    ],
    linkActiveClass: 'active'
})

router.beforeEach((to,from,next) => {
    const token = auth.getToken();
    const tokenAge = auth.getTokenAge();
    if (to.name === 'reset-password') {
        next();
    } else if (to.name !== 'login' && to.name !== 'forgot-password') {
        if (!token) {
            next({ name: 'login' });
        } else if (tokenAge <= Date.now()) {
            console.log('Anda perlu login kembali.');
            auth.logout();
            next({ name: 'login' });
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;