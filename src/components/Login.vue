<template>
    <div class="container mb-3" id="login-form-container">
        <form @submit.prevent="login">
            <h3 class="text-center">NRC-Archiving</h3>
            <p class="text-center">Account Login</p>
            <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" class="form-control border border-grey border-2" id="username" :value="user.username" @input="(ev) => user.username = ev.target.value" required><br>
            </div>

            <div class="mb-3">
                <label for="password">Kata sandi:</label>
                <input type="password" class="form-control border border-grey border-2" id="password" v-model="user.password" required><br>
            </div>
    
            <div class="mb-3">
                <button type="submit" class="btn btn-primary w-100">Login</button>
            </div>
            <div class="text-center">
                <router-link to="/forgot-password" style="text-decoration: none;">Lupa kata sandi?</router-link>
            </div>
        </form><br>
    </div>
</template>
    
<script setup>
import { useRouter } from 'vue-router';
import { inject } from 'vue';
const router = useRouter();
const auth = inject('$auth');

const token = auth.getToken();
if (token) {
    router.replace({ path: '/' });
}

let user = {username: '', password: ''};

async function login() {
    const formData = new URLSearchParams();
    formData.append('username', user.username);
    formData.append('password', user.password);

    try {
        const response = await fetch('http://localhost:8000/api/v1/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        })

        if (response.ok) {
            const responseData = await response.json();
            const data = responseData.data;
            auth.setToken(data.token);
            router.replace({ path: '/' });
            alert('Login successful!');
        } else {
            alert('Login failed. Please check your credentials.')
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An error occurred. Please try again later.')
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
    padding: 6vh 12vh;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    background-color: rgba(249, 249, 249, 0.3);
    border-radius: 6vh;
}

button:hover {
    background-color: #45a049;
}
</style>