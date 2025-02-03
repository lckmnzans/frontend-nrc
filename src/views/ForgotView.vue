<template>
    <div class="container mb-3" id="forgot-form-container">
        <form @submit.prevent="forgotPassword">
            <h3 class="text-center">NRC-Archiving</h3>
            <p class="text-center">Permintaan reset kata sandi</p>
            <div class="mb-2 form-group">
                <label for="username" class="form-label">Username:</label>
                <input type="text" class="form-control border border-grey border-2" id="username" v-model="username" required><br>
            </div>
    
            <div class="mb-2 form-group">
                <label for="email" class="form-label">Email:</label>
                <input type="email" class="form-control border border-grey border-2" id="email" v-model="email" required><br>
            </div>

            <div v-if="response.error">
                <div class="mb-4 alert alert-danger" role="alert" v-if="response.code == 404">
                    Username atau email tidak ditemukan. Cek kembali kredensial anda!
                </div>
                <div class="mb-4 alert alert-danger" role="alert" v-else-if="response.code == 500">
                    Gagal memproses permintaan. Silakan coba lagi nanti!
                </div>
            </div>
            <div v-else>
                <div class="bn-4 alert alert-success" role="alert" v-if="response.code == 200">
                    Permintaan sedang diproses. Link untuk reset akan dikirimkan lewat email.
                </div>
            </div>
    
            <div class="mb-3">
                <button type="submit" class="btn btn-primary w-100" :disabled="isFormInvalid || loading">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
                    <span class="text" v-else>Forgot Password</span>
                </button>
            </div>
        </form><br>
    </div>
</template>
<script>
import api from '@/api/account.api';
export default {
    inject: ['$auth'],
    data() {
        return {
            response: {
                error:false,
                code: 0
            },
            loading: false,
            username: '',
            email: ''
        }
    },
    computed: {
        isFormInvalid() {
            return (!this.username || !this.email);
        }
    },
    methods: {
        async forgotPassword() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            const formdata = {
                username: this.username,
                email: this.email
            }
            this.axios(api.forgot(formdata))
            .then(response => {
                this.response.code = response.status;

                if (response.status = 200) {
                    const body = response.data;
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
            })
            .finally(() => {
                this.loading = false;
            });
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
    padding: 3rem 4rem;
    /* box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); */
    background-color: rgba(249, 249, 249, 0.3);
    border-radius: 1rem;
    border: 1px solid #ccc;
}
</style>