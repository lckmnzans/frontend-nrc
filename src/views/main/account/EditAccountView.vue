<template>
    <div class="header">
        <h4>Buat Akun</h4>
    </div>
    <div class="content">
        <form @submit.prevent="submitChange">
            <div class="mb-3">
                <label for="" class="form-label">Username</label>
                <input type="text" class="form-control" v-model="user.username" disabled>
            </div>
            <div class="mb-3">
                <label for="" class="form-label">Email</label>
                <input type="text" class="form-control" v-model="user.email" disabled>
            </div>
            <div class="mb-3 form-group">
                <label for="" class="form-label">Role</label>
                <select class="form-control" v-model="user.role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                </select>
            </div>
            <div>
                <button type="submit" :disabled="isFormValid" class="btn btn-primary btn-sm">Simpan</button>
            </div>
        </form>
    </div>
</template>
<script>
import api from '@/api/account.api';
import { mapActions } from 'pinia';
import { useToastStore } from '@/store/toastStore';
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
            }
        }
    },
    methods: {
        ...mapActions(useToastStore, ['setToast']),
        fetchData() {
            this.axios(api.getAccount(this.userId))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
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