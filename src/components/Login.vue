<template>
    <div class="container mb-3" id="login-form-container">
        <form @submit.prevent="login">
            <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" class="form-control" id="username" :value="user.username" @input="(ev) => user.username = ev.target.value" required><br>
            </div>
    
            <div class="mb-3">
                <label for="password">Password:</label>
                <input type="password" class="form-control" id="password" v-model="user.password" required><br>
            </div>
    
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Login</button>
            </div>
            <router-link to="/forgot-password">Lupa password?</router-link>
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
    width: 50vh;
    padding: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #f9f9f9;
}

button:hover {
    background-color: #45a049;
}
</style>