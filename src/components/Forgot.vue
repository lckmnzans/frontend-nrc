<template>
    <div class="container mb-3" id="forgot-form-container">
        <form @submit.prevent="">
            <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" class="form-control" id="username" required><br>
            </div>
    
            <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" class="form-control" id="email" required><br>
            </div>
    
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Forgot Password</button>
            </div>
        </form><br>
    </div>
</template>
    
<!-- <script>
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
</script> -->

<style scoped>
#forgot-form-container {
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
</style>