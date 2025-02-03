<template>
    <div class="container mb-3" id="login-form-container">
        <form @submit.prevent="">
            <h3 class="text-center">NRC-Archiving</h3>
            <p class="text-center">Masuk dengan akun</p>

            <div class="mb-2 form-group">
                <label class="form-label">Username:</label>
                <input type="text" class="form-control border border-2" :class=" isCredentialWrong ? 'border-danger' : 'border-grey'" :value="user.username" @input="(ev) => user.username = ev.target.value">
            </div><br>

            <div class="mb-2 form-group">
                <label class="form-label">Kata sandi:</label>
                <div class="input-group" id="show_hide_password"> 
                    <input :type="isPasswordVisible ? 'text' : 'password'" class="form-control border border-2" :class=" isCredentialWrong ? 'border-danger' : 'border-grey'" v-model="user.password">
                    <button type="button" class="btn btn-light btn-outline-secondary" @click.prevent="togglePasswordVisibility">
                        <FontAwesomeIcon :icon="passwordToggleIcon"/>
                    </button>
                </div>
            </div><br>
    
            <div v-if="response.error">
                <div class="mb-4 alert alert-danger" role="alert" v-if="response.code == 401">
                    Login gagal. Cek kembali kredensial anda!
                </div>
                <div class="mb-4 alert alert-danger" role="alert" v-else-if="response.code == 500">
                    Gagal memproses permintaan. Silakan coba lagi nanti!
                </div>
            </div>
            <div v-else>
                <div class="bn-4 alert alert-success" role="alert" v-if="response.code == 200">
                    Login berhasil. Anda akan dialihkan ke halaman utama.
                </div>
            </div>

            <div class="mb-3 form-group">
                <button :disabled="isFormInvalid || loading" type="submit" class="btn btn-primary btn-bkg w-100" @click="login">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
                    <span class="text" v-else>Masuk</span>
                </button>
            </div>
            <div class="text-center">
                <a>Lupa </a>
                <router-link to="/forgot-password" style="text-decoration: none; color: #eb623f;">kata sandi?</router-link>
            </div>
        </form><br>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '@/api/account.api';
export default {
    components: { FontAwesomeIcon },
    inject: ['$auth'],
    data() {
        return {
            response: {
                error: false,
                code: 0,
            },
            loading: false,
            isPasswordVisible: false,
            user: {
                username: '',
                password: ''
            }
        }
    },
    computed: {
        isCredentialWrong() {
            return this.response.code == 401 && this.response.error;
        },
        isFormInvalid() {
            return (!this.user.username || !this.user.password);
        },
        passwordToggleIcon() {
            return (this.isPasswordVisible) ? faEye : faEyeSlash;
        }
    },
    methods: {
        togglePasswordVisibility() {
            this.isPasswordVisible = !this.isPasswordVisible;
        },
        async login() {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            const user = this.user;
            this.axios(api.login(user))
            .then(response => {
                this.response.code = response.status;
                
                if (response.status = 200) {
                    this.response.error = false;

                    const body = response.data;
                    this.$auth.setToken(body.data.token);
                    this.$auth.setTokenAge(body.data.tokenAge);
                    this.$auth.setRole(body.data.role);
                    this.$auth.setUser(body.data.id);
                    this.$router.replace({ path: '/' });
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
#login-form-container {
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

a, a:hover {
    color: #222;
}
</style>