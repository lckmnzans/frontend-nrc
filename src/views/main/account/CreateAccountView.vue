<template>
    <div class="create-account-view">
        <h4>Tambah Akun</h4>
        <form>
            <div class="mb-3" id="form-col-1">
                <div class="form-group">
                    <label for="" class="form-label">Username</label>
                    <input type="text" class="form-control" v-model="user.username">
                </div>
                <div class="form-group">
                    <label for="" class="form-label">Email</label>
                    <input type="text" class="form-control" v-model="user.email">
                </div>
                <div class="form-group">
                    <label for="" class="form-label">Role</label>
                    <select class="form-select" v-model="user.role">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                    </select>
                </div>
            </div>
            <div class="mb-3" id="form-col-2">
                <div class="form-group">
                    <label for="" class="form-label">Password</label>
                    <input type="password" class="form-control" v-model="user.password">
                </div>
                <div class="form-group">
                    <label for="" class="form-label">Password Confirmation</label>
                    <input type="password" class="form-control" v-model="user.password2">
                </div>
            </div>
        </form>
        
        <div class="alert-container mb-3 mt-3">
            <div v-if="response.error">
                <div class="mb-4 alert alert-danger" role="alert" v-if="response.code == 409">
                    Username atau email sudah dipakai.
                </div>
                <div class="mb-4 alert alert-danger" role="alert" v-else-if="response.code == 500">
                    Gagal memproses permintaan. Silakan coba lagi nanti!
                </div>
            </div>
            <div v-else>
                <div class="bn-4 alert alert-success" role="alert" v-if="response.code == 200">
                    Akun berhasil ditambahkan. Anda akan dikembalikan ke halaman sebelumnya.
                </div>
            </div>
        </div>

        <div>
            <button @click.prevent="register"  :disabled="isFormValid || loading" class="btn btn-primary">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
                <span class="text">Tambahkan</span>
            </button>
        </div>
    </div>
</template>
<script>
import { useToastStore } from '@/store/toastStore';
import { mapActions } from 'pinia';
import api from '@/api/account.api';
export default {
    inject: ['$auth'],
    created() {
        const role = this.$auth.getRole();
        if (role !== 'superadmin') {
            router.replace({ path: '/' });
        }
    },
    computed: {
        isFormValid() {
            return (!this.user.username || !this.user.email || !this.user.role || !this.user.password || !(this.user.password === this.user.password2));
        }
    },
    data() {
        return {
            response: {
                error: false,
                code: 0
            },
            loading: false,
            user: {
                username: '',
                email: '',
                role: 'user',
                password: '',
                password2: ''
            }
        }
    },
    methods: {
        ...mapActions(useToastStore, ['setToast']),
        register() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            const userdata = this.user;
            this.axios(api.register(userdata))
            .then(response => {
                this.response.code = response.status;
                if (response.status = 200) {
                    const body = response.data;
                    this.setToast('', 'Akun berhasil dibuat.', 3000);
                    this.response.error = false;
                    this.$router.back();
                } else {
                    const message = response.data.message;
                    this.setToast('', 'Akun gagal dibuat', 3000);
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
.create-account-view {
    position: relative;
    padding: 1rem 3rem 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;

    form {
        margin-top: 2rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 2rem;

        #form-col-1 {
            display: flex;
            flex-direction: column;
            width: 46%;
            min-width: 400px;
            gap:1rem;
        }

        #form-col-2 {
            display: flex;
            flex-direction: column;
            width: 46%;
            min-width: 400px;
            gap:1rem;
        }
    }

    .alert-container {
        width: 400px;
    }
}
</style>