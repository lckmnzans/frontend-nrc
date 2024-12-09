<template>
    <h4>Profile Anda</h4>
    <p>Ini adalah halaman profil anda</p>
    <LoadingOverlay :visible="loading" />
    <form>
        <div class="form-group mb-3">
            <label for="">Username</label>
            <input type="text" :disabled="true" placeholder="username" v-model="user.username" class="form-control">
        </div>
        <div class="form-group mb-3">
            <label for="">Email</label>
            <input type="text" :disabled="true" placeholder="email" v-model="user.email" class="form-control">
        </div>
    </form>
    <button @click="goChangePassword" class="btn btn-primary">Ganti Password</button>
</template>
<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import api from '../../api/account.api';
export default {
    components: {
        LoadingOverlay
    },
    inject: ['$axios','$auth'],
    created() {
        this.$watch(() => this.load, this.fetchData, { immediate: true })
    },
    data() {
        return {
            user: {
                username: '',
                email: ''
            },
            loading: false
        }
    },
    methods: {
        async fetchData() {
            this.loading = true;

            const userId = JSON.parse(this.$auth.getUser()).id;
            this.$axios(api.getAccount(userId))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    this.user = { username: body.data.username, email: body.data.email };
                    console.log('Data berhasil diambil');
                    this.loading = false;
                } else {
                    console.log('Data gagal diambil');
                    this.loading = false;
                }
            })
            .catch(error => {
                console.error(error);
                this.loading = false;
            })
        },
        goChangePassword() {
            this.$router.push({ path: '/profile/change-password' });
        }
    }
}
</script>