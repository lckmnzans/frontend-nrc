<template>
    <div class="dashboard">
        <Sidebar />
        <div class="content">
            <div class="top-bar">
                <h4>{{ pageTitle }}</h4>
                <div class="top-bar-right">
                    <button class="button" @click="goToProfile"><span class="material-icons" id="btn-profile">account_circle</span></button>
                </div>
            </div>
            <main>
                <router-view />
            </main>
        </div>
    </div>
    <div class="toast-container">
        <Toast :show="toast" :title="toastTitle" :message="toastMessage" @update:show="setToastState" />
    </div>
    <div class="alert-container" v-if="alert">
        <Alert v-if="alert" :type="alertType" :message="alertMessage" :actions="alertActions" />
    </div>
</template>
<script>
import Sidebar from '@/components/Sidebar.vue';
import Alert from '@/components/Alert.vue';
import Toast from '@/components/Toast.vue';
import api from '@/api/account.api';
import { mapState, mapActions } from 'pinia';
import { usePageStore } from '@/store';
import { useAlertStore } from '@/store/alertStore';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
export default {
    components: {
        Sidebar, Alert, Toast
    },
    inject: ['$auth'],
    created() {
        this.token = this.$auth.getToken();
        this.fetchProfile();
    },
    computed: {
        ...mapState(useToastStore, {
            toast: 'toast',
            toastTitle: 'toastTitle',
            toastMessage: 'toastMessage'
        }),
        ...mapState(useAlertStore, {
            alert: 'alert',
            alertType: 'alertType',
            alertMessage: 'alertMessage',
            alertActions: 'actions'
        }),
        ...mapState(usePageStore, {
            pageTitle: 'pageTitle'
        })
    },
    data() {
        return {
            token: ''
        }
    },
    methods: {
        goToProfile() {
            this.$router.push({ path: '/profile' });
        },
        async fetchProfile() {
            const userId = JSON.parse(this.$auth.getUser()).id;
            this.axios(api.getAccount(userId))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    this.user = { username: body.data.username, email: body.data.email };
                    this.saveProfile(this.user);
                    console.log('Data berhasil diambil');
                } else {
                    console.log('Data gagal diambil');
                }
            })
            .catch(error => {
                console.error(error);
            })
        },
        ...mapActions(useAlertStore, {
            setAlert: 'setAlert',
            setAlertState: 'setAlertState'
        }),
        ...mapActions(useToastStore, {
            setToast: 'setToast',
            setToastState: 'setToastState'
        }),
        ...mapActions(useUserStore, {
            saveProfile: 'saveProfile'
        })
    }
}
</script>
<style lang="scss" scoped>
.dashboard {
    display: flex;
    height: 100vh;
    width: 100vw;

    Sidebar {
        flex: 0 0 auto;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: var(--light);

        .top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: var(--primary);
            color: var(--light);
            padding: 1rem 2rem;

            .top-bar-right {
                display: flex;
                justify-content: end;

                button {
                    border: none;
                    appearance: none;
                    outline: none;
                    background: none;
                    color: var(--light);
                }

                #btn-profile {
                    font-size: 2rem;
                }   
            }
        }

        main {
            flex: 1 1 0;
            overflow-y: auto;
            overflow-x: auto;

            @media (max-width: 768px) {
                padding-left: 6rem;
            }
        }
    }
}

.toast-container {
    bottom: 0;
    right: 0;
    margin-bottom: 1rem;
    margin-right: 1rem;
    position: fixed;
    z-index: 998;
}

.alert-container {
    display: flex;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 999;
}
</style>