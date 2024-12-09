<template>
    <form>
        <div class="form-group mb-3">
            <label for="">Username</label>
            <input type="text" :disabled="true" v-model="user.username" class="form-control">
        </div>
        <div class="form-group mb-3">
            <label for="">Old Password</label>
            <input type="password" v-model="user.oldPassword" class="form-control">
        </div>
        <div class="form-group mb-3">
            <label for="">New Password</label>
            <input type="password" v-model="user.newPassword" class="form-control">
        </div>
    </form>
</template>
<script>
import api from '../api/account.api';
export default {
    inject: ['$axios'],
    data() {
        return {
            user: {
                username: '',
                oldPassword: '',
                newPassword: ''
            }
        }
    },
    methods: {
        changePassword() {
            this.$axios(api.changePassword(this.user))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    alert('Password berhasil dirubah');
                } else {
                    alert('Gagal memproses permintaan');
                }
            })
            .catch(error => {
                alert('Permintaan tidak bisa diproses, silahkan coba lagi');
            })
        }
    }
}
</script>