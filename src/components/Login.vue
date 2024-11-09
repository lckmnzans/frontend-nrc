<template>
    <div id="login-form-container">
        <form @submit.prevent="login">
            <label for="username">Username:</label>
            <input type="text" id="username" required><br>
    
            <label for="password">Password:</label>
            <input type="password" id="password" required><br>
    
            <button type="submit">Login</button>
        </form>
    </div>
</template>
    
<script>
export default {
    methods: {
        async showValue() {
            let username = document.getElementById('username').value;
            let password = document.getElementById('password').value;
            alert(username + ' ' + password);
        },
        async login() {
            let username = document.getElementById('username').value;
            let password = document.getElementById('password').value;

            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

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
                    alert('Login successful!');
                } else {
                    alert('Login failed. Please check your credentials.')
                }
            } catch (error) {
                console.error('Error:', error)
                alert('An error occurred. Please try again later.')
            }
        }
    }
}
</script>
    
<style>
#login-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #f9f9f9;
}

label, input, button {
    width: 100%;
    margin-bottom: 10px;
}

button {
    padding: 10px;
    border: none;
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
}

button:hover {
    background-color: #45a049;
}
</style>