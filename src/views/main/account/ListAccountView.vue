<template>
    <div class="header">
        <h4>Manajemen Akun</h4>
        <div>
            <router-link to="/accounts/create" class="btn btn-primary btn-sm">Tambah Akun</router-link>
        </div>
    </div>
    <div class="content">
        <table class="table-bordered table-hover">
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
                        <button class="btn btn-approve" :disabled="forgotPasswordRequest(user.resetStatus)" @click.prevent="approveResetRequest(user, true)">Approve</button>
                        <button class="btn btn-cancel" :disabled="forgotPasswordRequest(user.resetStatus)" @click.prevent="approveResetRequest(user, false)">Cancel</button>
                    </td>
                </tr>
            </tbody>
        </table>
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
                if (response.status = 200) {
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
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.content {
    display: flex;
    flex-direction: column;

    table {
        border: var(--primary);
    }

    thead {
        background-color: var(--dark);
    }

    th {
        text-align: center;
        color: var(--light);
        padding: 5px 5px;
    }

    td {
        padding: 5px;
    }

    .action-button {
        border-left-width: 0;
        padding: 5px;
        gap:10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
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