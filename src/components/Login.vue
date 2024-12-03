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
                    <button type="button" class="btn btn-outline-secondary" @click.prevent="togglePasswordVisibility">
                        <font-awesome-icon :icon="isPasswordVisible ? 'eye' : 'eye-slash'" />
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
import api from '../api/account.api';
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
            isPasswordVisible: false,
            token: '',
            user: {
                username: '',
                password: ''
            }
        }
    },
    computed: {
        isFormInvalid() {
            return (!this.user.username || !this.user.password);
        }
    },
    methods: {
        togglePasswordVisibility() {
            this.isPasswordVisible = !this.isPasswordVisible;
        },
        async login() {
            const user = this.user;
            this.$axios(api.login(user))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    this.$auth.setToken(body.data.token);
                    this.$auth.setRole(body.data.role);
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

<!-- <script setup>
import { useRouter } from 'vue-router';
import { reactive, ref, inject, computed } from 'vue';
const router = useRouter();
const auth = inject('$auth');
const axios = inject('$axios');
import api from '../api/account.api';

const isPasswordVisible = ref(false);
const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
}
const token = auth.getToken();
if (token) {
    router.replace({ path: '/' });
}

const user = reactive({username: '', password: ''});
const isFormInvalid = computed(() => {
    return (!user.username || !user.password);
});

async function login() {
    axios(api.login(user))
    .then(response => {
        if (response.status = 200) {
            const body = response.data;
            auth.setToken(body.data.token);
            router.replace({ path: '/' });
            alert('Login successful!');
        } else {
            alert('Login failed. Please check your credentials.')
        }
    })
    .catch(error => {
        alert('An error occurred. Please try again later.')
    })
}
</script> -->
    
<style scoped>
#login-form-container {
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

a, a:hover {
    color: #222;
}
</style>