import { createRouter, createWebHistory } from 'vue-router';
import { usePageStore } from './store';
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
                            component: () => import('@/views/main/profile/YourProfileView.vue'),
                            meta: {
                                title: 'Profil Anda'
                            }
                        },      
                        {   name: 'change-password',
                            path: ':username/change-password',
                            component: () => import('@/views/main/profile/ChangePasswordView.vue'),
                            props: true,
                            meta: {
                                title: 'Ubah Kata Sandi'
                            }
                        }
                    ]
                },
                {   path: '',
                    component: HomeView,
                    children: [
                        {   name: 'home',
                            alias: 'dashboard',
                            path: '',
                            component: () => import('@/views/main/dashboard/MainDashboardView.vue'),
                            meta: {
                                title: 'Beranda'
                            }
                        },
                        {   name: 'list-document',
                            path: 'list',
                            component: DocumentListView,
                            meta: {
                                title: 'Daftar Dokumen'
                            }
                        },
                        {   name: 'edit-document',
                            path: 'edit/:docType/:docId',
                            component: DocumentEditView,
                            props: true,
                            meta: {
                                title: 'Edit Dokumen'
                            }
                        },
                        {   name: 'review-document',
                            path: 'review/:docType/:docId',
                            component: DocumentReviewView,
                            props: true,
                            meta: {
                                title: 'Review Dokumen'
                            }
                         }
                    ]
                },
                {   name: 'category',
                    path: 'category',
                    children: [
                        {   path: '1',
                            component: Category1View,
                            meta: {
                                title: 'Kategori Badan Usaha'
                            },
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
                            meta: {
                                title: 'Kategori Surat Menyurat'
                            },
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
                            meta: {
                                title: 'Kategori Kepemilikan Tanah'
                            },
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
                {   name: 'accounts',
                    path: 'accounts',
                    component: AccountView,
                    children: [
                        {   path: '',
                            component: () => import('@/views/main/account/ListAccountView.vue'),
                            meta: {
                                title: 'Daftar Akun'
                            }
                        },
                        {   path: 'create',
                            component: () => import('@/views/main/account/CreateAccountView.vue'),
                            meta: {
                                title: 'Tambah Akun'
                            }
                        },
                        {   path: 'edit/:userId',
                            component: () => import('@/views/main/account/EditAccountView.vue'),
                            props: true,
                            meta: {
                                title: 'Ubah Akun'
                            }
                        }
                    ]
                }
            ]
        }
    ],
    linkActiveClass: 'active'
})

router.beforeEach((to,from,next) => {
    const pageStore = usePageStore();
    if (to.meta.title) {
        pageStore.setPageTitle(to.meta.title);
    } else {
        if (to.name !== 'login' && to.name !== 'forgot-password' && to.name !== 'reset-password') {
            const recordWithTitle = to.matched.find(record => record.meta && record.meta.title);
            if (recordWithTitle) {
                pageStore.setPageTitle(recordWithTitle.meta.title);
            }
        }
    }

    const token = auth.getToken();
    const tokenAge = auth.getTokenAge();
    const role = auth.getRole();
    
    if (to.name === 'reset-password') {
        if (tokenValidity(token, tokenAge)) {
            return next({ name: 'home'});
        }
        return next();
    } 
    
    if (to.name !== 'login' && to.name !== 'forgot-password') {
        if (tokenValidity(token, tokenAge)) {
            if (role === 'user') {
                // restricted route for role 'user'
                const targetRoute = to.matched.some(record => record.name === 'category' || record.name === 'accounts' || record.name === 'review-document');
                if (targetRoute) {
                    return next({ name: 'home'});
                }
                return next();
            }
            if (role === 'admin') {
                // restricted route for role 'admin'
                const targetRoute = to.matched.some(record => record.name === 'accounts' || record.name === 'review-document');
                if (targetRoute) {
                    return next({ name: 'home'});
                }
                return next();
            }
            return next();
        }
        auth.logout();
        return next({ name: 'login' });
    }

    if (to.name === 'login' || to.name === 'forgot-password') {
        if (!tokenValidity(token, tokenAge)) {
            auth.logout();
            return next();
        }
        return next({ name: 'home' });
    }

    return next();
})

const tokenValidity = (token, tokenAge) => {
    if (token && tokenAge > Date.now()) {
        return true;
    } else if (token && tokenAge <= Date.now()) {
        return false;
    } else {
        return false;
    }
}

export default router;