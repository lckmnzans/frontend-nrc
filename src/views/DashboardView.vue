<template>
    <div class="dashboard">
        <Sidebar :pages :documents />
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
import docApi from '@/api/document.api';
import { io } from 'socket.io-client';
import { mapState, mapActions } from 'pinia';
import { usePageStore } from '@/store';
import { useAlertStore } from '@/store/alertStore';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { useDocumentsListStore } from '@/store/documentsStore';
export default {
    components: {
        Sidebar, Alert, Toast
    },
    inject: ['$auth'],
    created() {
        this.token = this.$auth.getToken();
        this.user = JSON.parse(this.$auth.getUser());
        this.fetchProfile();
        this.pages = JSON.parse(localStorage.getItem('pages'));
        this.documents = JSON.parse(localStorage.getItem('documents-type'));

        if (this.user) {
            const url = window.location.origin;
            this.socket = io(url, {
                transports:["websocket"],
            });

            this.socket.emit("register", this.user.id);

            this.socket.on("connect", () => {
                console.log("Connected to Websocket server: ", this.socket.id);
                const socketSession = {
                    id: this.socket.id,
                    userId: this.user.id,
                }
                sessionStorage.setItem('socket-session', JSON.stringify(socketSession));
            })

            this.socket.on("webhook_event", (data) => {
                this.notification = {
                    event: "webhook_event",
                    data: data
                };
            });
            
            this.socket.on("translation_request", (data) => {
                this.notification = {
                    event: "translation_request",
                    data: data
                }
            })

            this.socket.on("translation_completed", (data) => {
                this.notification = {
                    event: "translation_completed",
                    data: data
                }
            })
        }
    },
    watch: {
        notification(newVal, oldVal) {
            switch (newVal.event) {
                case "webhook_event":
                    this.setToast('Pesan Masuk', newVal, 3000);
                    break;
                case "translation_request":
                    this.setToast('Terjemah Dokumen', `Permintaan terjemah dokumen sedang diproses`, 3000);
                    this.translateTask.push({
                        reqId: newVal?.data?.req_id,
                        docName: newVal?.data?.filename,
                        status: 'pending'
                    })
                    break;
                case "translation_completed":
                    this.setToast('Terjemah Dokumen', `Permintaan terjemah dokumen selesai diproses`, 3000);
                    const idTask = this.translateTask.findIndex(task => task.reqId == newVal?.data?.req_id);
                    if (idTask != -1) {
                        this.translateTask[idTask].status = 'completed';
                    }
                    this.downloadTranslatedPdf(newVal?.data?.req_id);
                    break;
                default:
                    break;
            }

            console.log(newVal, oldVal);
        }
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
        }),
        ...mapState(useDocumentsListStore, {
            translateTask: 'translateTask'
        })
    },
    data() {
        return {
            token: '',
            socket: null,
            user: {},
            pages: [],
            documents: [],
            notification: null
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
                } else {
                    console.log('Data gagal diambil');
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        async downloadTranslatedPdf(reqId) {
            this.axios(docApi.getTranslatedDocument(reqId))
            .then(response => {
                if (response.status == 200) {
                    const blob = response.data;
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = reqId;
                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } else {
                    console.log('Gagal mengunduh dokumen. Status: ', response.status);
                }
            })
            .catch(err => {
                console.log('Terjadi kesalahan saat mengunduh dokumen. Error: ', err);
            });
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
        }),
        ...mapActions(useDocumentsListStore, {
            getTranslationTask: 'getTranslationTask'
        })
    }
}
</script>
<style lang="scss" scoped>
.dashboard {
    display: flex;
    height: 100vh;
    width: 100vw;
    background-color: #ddd;

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
            background-color: var(--primary-alt-6);
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