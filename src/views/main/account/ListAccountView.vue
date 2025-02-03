<template>
    <div class="list-account-view">
        <div class="header">
            <h4>Daftar Akun</h4>
            <div>
                <router-link to="/accounts/create" class="btn btn-primary btn-sm" id="btn-to-create-account">
                    <span class="text">Tambah Akun</span>
                    <span class="material-icons">add</span>
                </router-link>
            </div>
        </div>
        <div class="content">
            <table class="table table-hover">
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
                            <div id="actions-col-1">
                                <button class="btn btn-approve" :disabled="forgotPasswordRequest(user.resetStatus)" @click.prevent="approveResetRequest(user, true)">Approve</button>
                                <button class="btn btn-cancel" :disabled="forgotPasswordRequest(user.resetStatus)" @click.prevent="approveResetRequest(user, false)">Cancel</button>
                            </div>
                            <div id="actions-col-2">
                                <router-link :to="`/accounts/edit/${user._id}`"><span class="material-icons">edit</span></router-link>
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
export default {
    inject: ['$auth'],
    created() {
        const role = this.$auth.getRole();
        if (role !== 'superadmin') {
            router.replace({ path: '/' });
        }

        this.getAllAccounts();
    },
    data() {
        return {
            accounts: []
        }
    },
    methods: {
        async getAllAccounts() {
            this.axios(api.getAllAccounts())
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    this.accounts = body.data.accounts;
                } else {
                    alert('Failed to fetch data');
                }
            })
            .catch(error => {
                alert('An error occurred. Please try again later.')
            })
        },
        approveResetRequest(userdata, isApproved) {
            this.axios(api.approveRequest(userdata, isApproved))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    alert('Permintaan berhasil diproses');
                } else {
                    alert('Gagal memproses permintaan');
                }
            })
            .catch(error => {
                alert('Permintaan tidak bisa diproses, silahkan coba lagi')
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

    button {
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