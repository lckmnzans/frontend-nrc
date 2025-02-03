<template>
    <div class="modal fade" id="modalConfirmDelete" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConfirmDeleteLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalConfirmDeleteLabel">Konfirmasi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Anda yakin akan menghapus akun ini?</p>
                </div>
                <div class="modal-footer">
                    <div class="d-flex flex-row gap-3">
                        <button id="btn-next" class="btn btn-danger" data-bs-dismiss="modal" @click.prevent="deleteAccount">Lanjutkan</button>
                        <button id="btn-cancel" class="btn btn-secondary" data-bs-dismiss="modal">Batalkan</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="edit-account-view">
        <h4>Ubah Akun</h4>
        <form>
            <div class="mb-3" id="form-row-1">
                <div class="form-group">
                    <label for="" class="form-label">Username</label>
                    <input type="text" class="form-control" v-model="user.username" disabled>
                </div>
                <div class="form-group">
                    <label for="" class="form-label">Email</label>
                    <input type="text" class="form-control" v-model="user.email" disabled>
                </div>
            </div>
            <div class="mb-3" id="form-row-2">
                <div class="form-group">
                    <label for="" class="form-label">Role</label>
                    <select class="form-select" v-model="user.role">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                    </select>
                </div>
            </div>
        </form>
        <div class="action-container">
            <button @click.prevent="submitChange" :disabled="true" class="btn btn-primary">Simpan perubahan</button>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalConfirmDelete">Hapus akun</button>
        </div>
    </div>
</template>
<script>
import api from '@/api/account.api';
import { mapActions } from 'pinia';
import { useToastStore } from '@/store/toastStore';
import TestView from '@/views/TestView.vue';
export default {
    inject: ['$auth'],
    props: {
        userId: {
            type: String,
            required: true
        }
    },
    created() {
        const role = this.$auth.getRole();
        if (role !== 'superadmin') {
            router.replace({ path: '/' });
        }
        this.fetchData();
    },
    computed: {
        isFormValid() {
            return (!this.user.username || !this.user.email || !this.user.role);
        }
    },
    data() {
        return {
            user: {
                username: 'username',
                email: 'email@mail.co',
                role: 'admin'
            },
        }
    },
    methods: {
        ...mapActions(useToastStore, ['setToast']),
        fetchData() {
            this.axios(api.getAccount(this.userId))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    console.log(body);
                    this.user.username = body.data.username;
                    this.user.email = body.data.email;
                    this.user.role = body.data.role;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        submitChange() {
            const userdata = this.user;
            this.axios(api.updateAccount(userdata, 'role'))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    this.setToast('Notif', 'Role berhasil diubah.', 2000);
                    this.$router.back();
                } else {
                    const message = response.data.message;
                    console.log(message);
                    this.setToast('Notif', 'Role gagal diubah.', 2000);
                }
            })
            .catch(error => {
                alert('Permintaan tidak bisa diproses, silahkan coba lagi')
            })
        },
        deleteAccount() {
            const userdata = this.user;
            this.axios(api.deleteAcc(userdata))
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
        }
    }
}
</script>
<style scoped>
.edit-account-view {
    position: relative;
    padding: 1rem 3rem 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;

    #form-row-1 {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;

        .form-group {
            width: 46%;
            min-width: 400px;
        }
    }

    #form-row-2 {
        display: flex;
        width:max-content;
    }

    .action-container {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        gap: 3rem;
    }
}
</style>