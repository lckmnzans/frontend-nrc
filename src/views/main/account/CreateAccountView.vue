<template>
    <div class="header">
        <h4>Buat Akun</h4>
    </div>
    <div class="content">
        <form @submit.prevent="register">
            <div class="mb-3">
                <label for="" class="form-label">Username</label>
                <input type="text" class="form-control" v-model="user.username">
            </div>
            <div class="mb-3">
                <label for="" class="form-label">Email</label>
                <input type="text" class="form-control" v-model="user.email">
            </div>
            <div class="mb-3 form-group">
                <label for="" class="form-label">Role</label>
                <select class="form-control" v-model="user.role">
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="" class="form-label">Password</label>
                <input type="password" class="form-control" v-model="user.password">
            </div>
            <div class="mb-3">
                <label for="" class="form-label">Password Confirmation</label>
                <input type="password" class="form-control" v-model="user.password2">
            </div>
            <div>
                <button type="submit" :disabled="isFormValid" class="btn btn-primary btn-sm">Buat</button>
            </div>
        </form>
    </div>
</template>
<script>
import api from '../../../api/account.api';
export default {
    inject: ['$auth','$axios'],
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
            user: {
                username: '',
                email: '',
                role: 'admin',
                password: '',
                password2: ''
            }
        }
    },
    methods: {
        register() {
            const userdata = this.user;
            this.$axios(api.register(userdata))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    alert('Akun berhasil dibuat');
                } else {
                    const message = response.data.message;
                    alert('Gagal memproses permintaan');
                    console.log(message);
                }
            })
            .catch(error => {
                alert('Permintaan tidak bisa diproses, silahkan coba lagi')
            })
        }
    }
}
</script>
<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}
</style>