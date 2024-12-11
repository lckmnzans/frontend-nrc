<template>
    <div class="container mb-3" id="forgot-form-container">
        <form @submit.prevent="forgotPassword">
            <h3 class="text-center">NRC-Archiving</h3>
            <p class="text-center">Password Change Request</p>
            <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" class="form-control border border-grey border-2" id="username" v-model="username" required><br>
            </div>
    
            <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" class="form-control border border-grey border-2" id="email" v-model="email" required><br>
            </div>
    
            <div class="mb-3">
                <button type="submit" class="btn btn-primary w-100">Forgot Password</button>
            </div>
        </form><br>
    </div>
</template>
<script>
import api from '@/api/account.api';
export default {
    inject: ['$auth','$axios'],
    created() {
        this.token = this.$auth.getToken();
        if (this.token) {
            this.$router.replace({ path: '/' });
        }
    },
    data() {
        return {
            token: '',
            username: '',
            email: ''
        }
    },
    methods: {
        async forgotPassword() {
            const formdata = {
                username: this.username,
                email: this.email
            }
            this.$axios(api.forgot(formdata))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    const message = body.message;
                    alert(message);
                } else {
                    alert('Permintaan gagal diproses, cek kembali username dan email')
                }
            })
            .catch(error => {
                console.error('Error:', error)
                alert('Ada kesalahan. Silahkan coba lagi.')
            })
        }
    }
}
</script>

<style scoped>
#forgot-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

form {
    width: 70vh;
    padding: 6vh 12vh;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    background-color: rgba(249, 249, 249, 0.3);
    border-radius: 6vh;
}
</style>