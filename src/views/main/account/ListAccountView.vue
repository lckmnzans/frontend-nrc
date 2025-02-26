<template>
    <div class="list-account-view">
        <div class="header">
            <h4>Daftar Akun</h4>
            <div>
                <router-link to="/accounts/create" class="btn btn-primary btn-sm" id="btn-to-create-account" >
                    <span class="text">Tambah Akun</span>
                    <span class="material-icons">add</span>
                </router-link>
            </div>
        </div>
        <div class="content" style="min-height: 160px;">
            <div class="d-flex align-items-center justify-content-center" v-if="loading">
                <span class="spinner-border"></span>
            </div>
            <div class="d-flex flex-column align-items-center justify-content-center" v-else-if="!loading && !hasAnyData">
                <p>Data gagal diambil</p>
                <button class="btn btn-outline-secondary" @click.prevent="getAllAccounts">Reload</button>
            </div>
            <table class="table table-hover" v-else-if="!loading && hasAnyData">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Reset Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, _id) in accounts" :key="_id">
                        <td>{{ user.username }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.role }}</td>
                        <td>{{ user.resetStatus }}</td>
                        <td class="action-button">
                            <div id="actions-col-1" v-if="user.role != 'superadmin'">
                                <button class="btn btn-approve" :disabled="forgotPasswordRequest(user.resetStatus)" @click.prevent="approveResetRequest(user, true)" >Approve</button>
                                <button class="btn btn-cancel" :disabled="forgotPasswordRequest(user.resetStatus)" @click.prevent="approveResetRequest(user, false)" >Cancel</button>
                            </div>
                            <div id="actions-col-1" v-else>
                                <button class="btn" :disabled="true" style="color:white;background-color: white;">No Action</button>
                                <button class="btn" :disabled="true"  style="color:white;background-color: white;">No Action</button>
                            </div>
                            <div id="actions-col-2">
                                <div v-if="user.role != 'superadmin'">
                                    <router-link :to="`/accounts/edit/${user._id}`"><span class="material-icons">edit</span></router-link>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import api from '@/api/account.api';
import { useToastStore } from '@/store/toastStore';
import { mapActions } from 'pinia';
export default {
    inject: ['$auth'],
    created() {
        const role = this.$auth.getRole();
        if (role !== 'superadmin') {
            router.replace({ path: '/' });
        }

        this.$watch(() => this.load, this.getAllAccounts, { immediate: true });
    },
    computed: {
        hasAnyData() {
            return this.accounts.length >= 1;
        }
    },
    data() {
        return {
            response: {
                error: false,
                code: 0,
            },
            loading: false,
            accounts: []
        }
    },
    methods: {
        ...mapActions(useToastStore, {setToast: 'setToast'}),
        async getAllAccounts() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            this.axios(api.getAllAccounts())
            .then(response => {
                this.response.code = response.status;

                if (response.status == 200) {
                    this.response.error = false;

                    const body = response.data;
                    this.accounts = body.data.accounts;
                } else {
                    this.response.error = true;

                    this.setToast('Ada Kesalahan', 'Kesalahan dalam memuat data', 3000);
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('Ada Kesalahan', 'Kesalahan dalam memuat data', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
        approveResetRequest(userdata, isApproved) {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            this.axios(api.approveRequest(userdata, isApproved))
            .then(response => {
                this.response.code = response.status;

                if (response.status = 200) {
                    this.response.error = false;
                } else {
                    this.response.error = true;
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('Ada Kesalahan', 'Permintaan tidak bisa diproses', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
        forgotPasswordRequest(resetStatus) {
            return resetStatus !== 'pending';
        }
    }
}
</script>
<style lang="scss" scoped>
.list-account-view {
    padding: 1rem 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
}

.header {
    display: flex;
    margin: 0 2rem;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;

    #btn-to-create-account {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    th {
        background-color: var(--dark);
        color: var(--light);
    }

    .action-button {
        border-left-width: 0;
        padding: 5px;
        flex-wrap: wrap;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        #actions-col-1 {
            display: flex;
            flex-direction: row;
            gap: 1rem;
        }
    }

    table button {
        padding: 5px 10px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }

    .btn-approve {
        background-color: #4CAF50;
        color: white;
    }

    .btn-cancel {
        background-color: #f44336;
        color: white;
    }

    button:hover {
        opacity: 0.8;
    }
}
</style>