<template>
    <div class="modal fade" id="modalConfirmDelete" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConfirmDeleteLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalConfirmDeleteLabel">Konfirmasi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Anda yakin ingin menghapus akun ini?</p>
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
        <LoadingOverlay :visible="loading" />
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
                    <select class="form-select" v-model="user.role" :disabled="loading">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <!-- <option value="superadmin">Superadmin</option> -->
                    </select>
                </div>
            </div>
        </form>
        <div class="action-container">
            <button @click.prevent="submitChange" :disabled="isFormValid || loading || response.code == 500" class="btn btn-primary">Simpan perubahan</button>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalConfirmDelete" :disabled="loading || response.code == 500">Hapus akun</button>
        </div>
    </div>
</template>
<script>
import LoadingOverlay from '@/components/Loading.vue';
import api from '@/api/account.api';
import { mapActions } from 'pinia';
import { useToastStore } from '@/store/toastStore';
export default {
    components: { LoadingOverlay },
    props: {
        userId: {
            type: String,
            required: true
        }
    },
    inject: ['$auth'],
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
            response: {
                error: false,
                code: 0,
            },
            loading: false,
            user: {
                username: 'username',
                email: 'email@mail.co',
                role: 'user'
            },
        }
    },
    methods: {
        ...mapActions(useToastStore, ['setToast']),
        fetchData() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            this.axios(api.getAccount(this.userId))
            .then(response => {
                this.response.code = response.status;

                if (response.status == 200) {
                    this.response.error = false;
                    
                    const body = response.data;
                    this.user.username = body.data.username;
                    this.user.email = body.data.email;
                    this.user.role = body.data.role;
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
                this.setToast('Ada Kesalahan', 'Kesalahan dalam memuat data', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
        submitChange() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            const userdata = this.user;
            this.axios(api.updateAccount(this.userId, userdata, 'role'))
            .then(response => {
                this.response.code = response.status;

                if (response.status = 200) {
                    this.response.error = false;

                    this.setToast('Ganti role', 'Role berhasil diubah.', 2000);
                } else {
                    this.response.error = true;

                    this.setToast('Ganti role', 'Role gagal diubah.', 2000);
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('Ganti role', 'Kesalahan dalam mengubah role', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
        deleteAccount() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            const userdata = this.user;
            this.axios(api.deleteAcc(userdata))
            .then(response => {
                this.response.code = response.status;

                if (response.status == 200) {
                    this.response.error = false;
                    
                    this.setToast('Hapus akun', 'Akun berhasil dihapus.', 2000);
                    this.$router.back();
                } else {
                    this.response.error = true;

                    this.setToast('Hapus akun', 'Akun gagal dihapus.', 2000);
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('Hapus akun', 'Kesalahan dalam memproses permintaan', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
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


.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 997;
    border-radius: 6px;
}
</style>