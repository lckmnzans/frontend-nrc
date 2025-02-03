import { createRouter, createWebHistory } from 'vue-router';
import auth from './utils/auth';
import DashboardView from '@/views/DashboardView.vue';
import ResetView from '@/views/ResetPasswordView.vue';
import LoginView from '@/views/LoginView.vue';
import ForgotView from '@/views/ForgotView.vue';
import ProfileView from '@/views/main/profile/ProfileView.vue';
import HomeView from '@/views/main/dashboard/HomeView.vue';
import Category1View from '@/views/main/category/Category1View.vue';
import Category2View from '@/views/main/category/Category2View.vue';
import Category3View from '@/views/main/category/Category3View.vue';
import AccountView from '@/views/main/account/AccountsView.vue';
import DocumentListView from '@/views/main/dashboard/DocumentListView.vue';
import DocumentEditView from '@/views/main/dashboard/DocumentEditView.vue';
import DocumentReviewView from '@/views/main/dashboard/DocumentReviewView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {   name: 'login',
            path: '/login',
            component: LoginView
        },
        {   name: 'forgot-password',
            path: '/forgot-password',
            component: ForgotView
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
                {   path: '',
                    component: HomeView,
                    children: [
                        {   name: 'home',
                            alias: 'dashboard',
                            path: '',
                            component: () => import('@/views/main/dashboard/MainDashboardView.vue')
                        },
                        {   path: 'list',
                            component: DocumentListView,
                        },
                        {   path: 'edit/:docType/:docId',
                            component: DocumentEditView,
                            props: true,
                        },
                        {   path: 'review/:docType/:docId',
                            component: DocumentReviewView,
                            props: true
                         }
                    ]
                },
                {   name: 'category',
                    path: 'category',
                    children: [
                        {   path: '1',
                            component: Category1View,
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
                            component: Category2View,
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
                            component: Category3View,
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
                    component: AccountView,
                    children: [
                        {   path: '',
                            component: () => import('@/views/main/account/ListAccountView.vue')
                        },
                        {   path: 'create',
                            component: () => import('@/views/main/account/CreateAccountView.vue')
                        },
                        {   path: 'edit/:userId',
                            component: () => import('@/views/main/account/EditAccountView.vue'),
                            props: true
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