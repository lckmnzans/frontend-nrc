<template>
    <div class="container mb-3" id="login-form-container">
        <form @submit.prevent="">
            <h3 class="text-center">NRC-Archiving</h3>
            <p class="text-center">Account Login</p>
            <div class="mb-3 form-group">
                <label class="form-label">Username:</label>
                <input type="text" class="form-control border border-grey border-2" :value="user.username" @input="(ev) => user.username = ev.target.value">
            </div><br>

            <div class="mb-3 form-group">
                <label class="form-label">Kata sandi:</label>
                <div class="input-group" id="show_hide_password"> 
                    <input :type="isPasswordVisible ? 'text' : 'password'" class="form-control border border-grey border-2" v-model="user.password">
                    <button type="button" class="btn btn-light btn-outline-secondary" @click.prevent="togglePasswordVisibility">
                        <FontAwesomeIcon :icon="passwordToggleIcon"/>
                    </button>
                </div>
            </div><br>
    
            <div class="mb-3 form-group">
                <button :disabled="isFormInvalid" type="submit" class="btn btn-primary btn-bkg w-100" @click="login">Login</button>
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
    created() {
        // this.token = this.$auth.getToken();
        // if (this.token) {
        //     this.$router.replace({ path: '/' });
        // }
    },
    data() {
        return {
            isPasswordVisible: false,
            // token: '',
            user: {
                username: '',
                password: ''
            }
        }
    },
    computed: {
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
            const user = this.user;
            this.axios(api.login(user))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    this.$auth.setToken(body.data.token);
                    this.$auth.setTokenAge(body.data.tokenAge);
                    this.$auth.setRole(body.data.role);
                    this.$auth.setUser(body.data.id);
                    this.$router.replace({ path: '/' });
                    alert('Login successful!');
                } else {
                    alert('Login failed. Please check your credentials.')
                }
            })
            .catch(error => {
                alert('An error occurred. Please try again later.')
            })
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
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    background-color: rgba(249, 249, 249, 0.3);
    border-radius: 1rem;
}

a, a:hover {
    color: #222;
}
</style>