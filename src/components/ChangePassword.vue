<template>
    <div class="container">
        <form>
            <div class="form-group mb-3">
                <label for="">Username</label>
                <input type="text" :disabled="true" v-model="username" class="form-control">
            </div>
            <div class="form-group mb-3">
                <label for="">Old Password</label>
                <input type="password" v-model="oldPassword" class="form-control">
            </div>
            <div class="form-group mb-3">
                <label for="">New Password</label>
                <input type="password" v-model="newPassword" class="form-control">
            </div>
        </form>
    </div>
</template>
<script>
import api from '../api/account.api';
export default {
    inject: ['$axios'],
    data() {
        return {
            username: '',
            oldPassword: '',
            newPassword: ''
        }
    },
    methods: {
        changePassword() {
            this.$axios(api.changePassword(this.username, this.oldPassword, this.newPassword))
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