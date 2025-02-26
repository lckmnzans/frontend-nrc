<template>
    <div class="chgpass-view">
        <h4>Profile Anda</h4>
        <p>Ubah password akun anda</p>
        <LoadingOverlay :visible="loading" />
        <form @submit.prevent="submitChange">
            <div class="form-group mb-3">
                <label for="">Username</label>
                <input type="text" :disabled="true" v-model="user.username" class="form-control">
            </div>
            <div class="form-group mb-3">
                <label for="">Password lama</label>
                <input type="password" v-model="user.oldPassword" class="form-control" :disabled="doesChangePasswordSucceed || this.loading">
            </div>
            <div class="form-group mb-3">
                <label for="">Password baru</label>
                <input type="password" v-model="user.newPassword1" class="form-control" :disabled="doesChangePasswordSucceed || this.loading">
            </div>
            <div class="form-group mb-3">
                <label for="">Konfirmasi password baru</label>
                <input type="password" v-model="user.newPassword2" class="form-control" :disabled="doesChangePasswordSucceed || this.loading">
            </div>
            <div class="mb-3">
                <button :disabled="isFormEmpty || !isNewPasswordValid || doesChangePasswordSucceed" class="btn btn-mb btn-primary" type="submit">Simpan perubahan</button>
            </div>
        </form>
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
        username: String,
        required: true
    },
    inject: ['$auth'],
    created() {
        this.user.username = this.username;
    },
    computed: {
        isFormEmpty() {
            return Object.values(this.user).includes('');
        },
        isNewPasswordValid() {
            return this.user.newPassword1 === this.user.newPassword2;
        },
        doesChangePasswordSucceed() {
            return this.response.code == 200;
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
                oldPassword: '',
                newPassword1: '',
                newPassword2: ''
            },
        }
    },
    methods: {
        ...mapActions(useToastStore, {setToast:'setToast'}),
        async submitChange() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            const userId = JSON.parse(this.$auth.getUser()).id;
            const userdata = {
                username: this.user.username,
                oldPassword: this.user.oldPassword,
                newPassword: this.user.newPassword2
            }
            this.axios(api.updateAccount(userId, userdata, 'pass'))
            .then(response => {
                this.response.code = response.status;

                if (response.status = 200) {
                    this.response.error = false;

                    this.setToast('Ganti password', 'Password berhasil dirubah', 3000);
                } else {
                    this.response.error = true;

                    this.setToast('Ganti password', 'Gagal mengubah password', 3000);
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('Ganti password', 'Ada kesalahan. Periksa apakah password lama sudah benar?', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
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
    z-index: 997;
    border-radius: 6px;
}

form {
    margin-top: 1rem;
}
</style>