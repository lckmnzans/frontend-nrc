<template>
    <div class="profile-view">
        <h4>Profile Anda</h4>
        <p>Ini adalah halaman profil anda</p>
        <LoadingOverlay :visible="loading"/>
        <div class="form-group mb-3">
            <label for="">Username</label>
            <input type="text" :disabled="true" placeholder="username" v-model="user.username" class="form-control">
        </div>
        <div class="form-group mb-3">
            <label for="">Email</label>
            <input type="text" :disabled="true" placeholder="email" v-model="user.email" class="form-control">
        </div>
        <button @click="goChangePassword" class="btn btn-primary" :disabled="response.code == 500">Ganti Password</button>
    </div>
</template>
<script>
import LoadingOverlay from '@/components/Loading.vue';
import api from '@/api/account.api';
import { mapActions } from 'pinia';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
export default {
    components: { LoadingOverlay },
    inject: ['$auth'],
    created() {
        this.$watch(() => this.load, this.fetchData, { immediate: true });
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
                email: ''
            },
        }
    },
    methods: {
        ...mapActions(useToastStore, { setToast: 'setToast'}),
        ...mapActions(useUserStore, { saveProfile: 'saveProfile'}),
        async fetchData() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            const userId = JSON.parse(this.$auth.getUser()).id;
            this.axios(api.getAccount(userId))
            .then(response => {
                this.response.code = response.status;

                if (response.status = 200) {
                    const body = response.data;
                    this.user = { username: body.data.username, email: body.data.email };
                    this.saveProfile(this.user);

                    this.response.error = false;
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
        goChangePassword() {
            this.$router.push({ path: `/profile/${this.user.username}/change-password` });
        },
    }
}
</script>
<style lang="scss" scoped>
.profile-view {
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
</style>