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
            component: LoginView,
            meta: {
                indexed: true
            }
        },
        {   name: 'forgot-password',
            path: '/forgot-password',
            component: ForgotView,
            meta: {
                indexed: true
            }
        },
        {   name: 'reset-password',
            path: '/reset-password',
            component: ResetView,
            props: (route) => ({ token: route.query.token }),
            meta: {
                indexed: true
            }
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
                                title: 'Profil Anda',
                                indexed: true
                            }
                        },      
                        {   name: 'change-password',
                            path: ':username/change-password',
                            component: () => import('@/views/main/profile/ChangePasswordView.vue'),
                            props: true,
                            meta: {
                                title: 'Ubah Kata Sandi',
                                indexed: true
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
                                title: 'Beranda',
                                indexed: true
                            }
                        },
                        {   name: 'list-document',
                            path: 'list',
                            component: DocumentListView,
                            meta: {
                                title: 'Daftar Dokumen',
                                indexed: true
                            }
                        },
                        {   name: 'edit-document',
                            path: 'edit/:docType/:docId',
                            component: DocumentEditView,
                            props: true,
                            meta: {
                                title: 'Edit Dokumen',
                                indexed: true
                            }
                        },
                        {   name: 'review-document',
                            path: 'review/:docType/:docId',
                            component: DocumentReviewView,
                            props: true,
                            meta: {
                                title: 'Review Dokumen',
                                indexed: true
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
                                    component: () => import('@/views/main/category/forms/FormA01View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'A02',
                                    component: () => import('@/views/main/category/forms/FormA02View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'A03',
                                    component: () => import('@/views/main/category/forms/FormA03View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'A04',
                                    component: () => import('@/views/main/category/forms/FormA04View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'A05',
                                    component: () => import('@/views/main/category/forms/FormA05View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'A06',
                                    component: () => import('@/views/main/category/forms/FormA06View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'A07',
                                    component: () => import('@/views/main/category/forms/FormA07View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'A08',
                                    component: () => import('@/views/main/category/forms/FormA08View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'A09',
                                    component: () => import('@/views/main/category/forms/FormA09View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'A10',
                                    component: () => import('@/views/main/category/forms/FormA10View.vue'),
                                    meta: {
                                        indexed: true
                                    }
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
                                    component: () => import('@/views/main/category/forms/FormB01View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'B02',
                                    component: () => import('@/views/main/category/forms/FormB02View.vue'),
                                    meta: {
                                        indexed: true
                                    }
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
                                    component: () => import('@/views/main/category/forms/FormC01View.vue'),
                                    meta: {
                                        indexed: true
                                    }
                                },
                                {   path: 'C02',
                                    component: () => import('@/views/main/category/forms/FormC02View.vue'),
                                    meta: {
                                        indexed: true
                                    }
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
                                title: 'Daftar Akun',
                                indexed: true
                            }
                        },
                        {   path: 'create',
                            component: () => import('@/views/main/account/CreateAccountView.vue'),
                            meta: {
                                title: 'Tambah Akun',
                                indexed: true
                            }
                        },
                        {   path: 'edit/:userId',
                            component: () => import('@/views/main/account/EditAccountView.vue'),
                            props: true,
                            meta: {
                                title: 'Ubah Akun',
                                indexed: true
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
        if (!to.meta?.indexed) {
            return next({ name: 'home'});
        }
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