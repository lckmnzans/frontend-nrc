<template>
    <div class="chgpass-view">
        <h4>Profile Anda</h4>
        <p>Ini adalah halaman ganti password</p>
        <LoadingOverlay :visible="loading" />
        <form @submit.prevent="changePassword">
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
            <div class="mb-3">
                <button :disabled="isFormEmpty" class="btn btn-mb btn-primary" type="submit">Simpan perubahan</button>
            </div>
        </form>
    </div>
</template>
<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import api from '@/api/account.api';
export default {
    components: { LoadingOverlay },
    props: {
        username: String,
        required: true
    },
    inject: ['$axios'],
    created() {
        this.user.username = this.username;
    },
    computed: {
        isFormEmpty() {
            return Object.values(this.user).includes('');
        }
    },
    data() {
        return {
            user: {
                username: '',
                oldPassword: '',
                newPassword: ''
            },
            loading: false
        }
    },
    methods: {
        async changePassword() {
            this.loading = true;
            this.$axios(api.changePassword(this.user))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    this.loading = false;
                    alert('Password berhasil dirubah');
                    this.$router.back();
                } else {
                    this.loading = false;
                    alert('Gagal memproses permintaan');
                }
            })
            .catch(error => {
                this.loading = false;
                alert('Permintaan tidak bisa diproses, silahkan coba lagi.');
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.chgpass-view {
    position: relative;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
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
    z-index: 9999;
}

form {
    margin-top: 1rem;
}
</style>