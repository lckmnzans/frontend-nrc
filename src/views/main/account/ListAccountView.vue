<template>
    <div>
        <div class="modal fade" id="modalConfirmView" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConfirmViewLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalConfirmViewLabel">Title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Content</p>
                    </div>
                    <div class="modal-footer">
                        <div class="d-flex flex-row gap-3">
                            <button id="btn-next" class="btn btn-danger" data-bs-dismiss="modal">Lanjutkan</button>
                            <button id="btn-cancel" class="btn btn-secondary" data-bs-dismiss="modal">Batalkan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="header">
        <h4>Daftar Akun</h4>
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
                        <button type="button" data-bs-toggle="modal" data-bs-target="#modalConfirmView" :data-bs-username="user.username" :data-bs-email="user.email"><span class="material-icons">delete</span></button>
                        <router-link :to="`/accounts/edit/${user._id}`"><span class="material-icons">edit</span></router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import api from '@/api/account.api';
import { useEventListener } from '@vueuse/core';
import axios from 'axios';
export default {
    inject: ['$auth'],
    setup() {
        useEventListener(document, 'show.bs.modal', (event) => {
            var button = event.relatedTarget;
            var username = button.getAttribute('data-bs-username');
            var email = button.getAttribute('data-bs-email');

            var confirmModal = document.getElementById('modalConfirmView');

            var modalTitle = confirmModal.querySelector('.modal-title');
            var modalBody = confirmModal.querySelector('.modal-body p');

            modalTitle.textContent = 'Konfirmasi penghapusan'
            modalBody.textContent = 'Apakah anda yakin akan menghapus akun ?';
            
            var yesBtn = confirmModal.querySelector('.modal-footer #btn-next');
            var noBtn = confirmModal.querySelector('.modal-footer #btn-cancel');
            useEventListener(document, 'click', (e) => {
                if (e.target === yesBtn) {
                    const userdata = {
                        username: username,
                        email: email
                    }
                    axios(api.deleteAcc(userdata))
                    .then(response => {
                        if (response.status == 200) {
                            const body = response.data;
                            const dataStr = JSON.stringify(body.data);
                            console.log('Sukses menghapus akun. ' + dataStr);
                        } else {
                            console.log('Gagal menghapus akun.');
                        }
                    })
                    .catch(error => {
                        console.log('Terjadi kesalahan. Error: ' + error);
                    });
                } else if (e.target === noBtn) {
                    console.log('Batalkan');
                }
            })
        })
    },
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