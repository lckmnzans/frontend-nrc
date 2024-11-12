<template>
    <div id="forgot-form-container">
        <form @submit.prevent="forgot">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" required><br>
    
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required><br>
    
            <button type="submit">Forgot Password</button>
        </form><br>
    </div>
</template>
    
<script>
export default {
    methods: {
        async showValue() {
            let username = document.getElementById('username').value;
            let email = document.getElementById('email').value;
            alert(username + ' ' + email);
        },
        async forgot() {
            let username = document.getElementById('username').value;
            let email = document.getElementById('email').value;

            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('email', email);

            try {
                const response = await fetch('http://localhost:8000/api/v1/account/request-reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: formData
                })

                if (response.ok) {
                    const responseData = await response.json();
                    const message = responseData.message;
                    alert(message);
                } else {
                    alert('Permintaan gagal diproses, cek kembali username dan email');
                }
            } catch (error) {
                console.error('Error:', error)
                alert('Ada kesalahan. Silakan coba lagi.')
            }
        }
    }
}
</script>
    
<!-- <style>
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
</style> -->