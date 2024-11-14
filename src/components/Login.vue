<template>
    <div class="container mb-3" id="login-container">
        <form @submit.prevent="login">
            <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" class="form-control" id="username" :value="username" @input="(ev) => username = ev.target.value" required><br>
            </div>
    
            <div class="mb-3">
                <label for="password">Password:</label>
                <input type="password" class="form-control" id="password" v-model="password" required><br>
            </div>
    
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Login</button>
            </div>
            <a :href="link.url" :title="link.title">Lupa password?</a>
        </form><br>
    </div>
</template>
    
<script>
export default {
    props: ['formFilled'],
    data() {
        return {
            link: {
                url:'Forgot.html',
                title: 'Reset password'
            },
            username: '',
            password: ''
        }
    },
    methods: {
        async login() {
            const formData = new URLSearchParams();
            formData.append('username', this.username);
            formData.append('password', this.password);

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
                    this.storeLogin(data.token);
                    alert('Login successful!');
                } else {
                    alert('Login failed. Please check your credentials.')
                }
            } catch (error) {
                console.error('Error:', error)
                alert('An error occurred. Please try again later.')
            }
        },
        storeLogin(accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
    }
}
</script>
    
<style>
#login-container {
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