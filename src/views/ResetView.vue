<template>
    <div class="container mb-3" id="reset-form-container">
        <form @submit.prevent="resetPassword">
            <h3 class="text-center">NRC-Archiving</h3>
            <p class="text-center">Password Change Request</p>
            <div class="mb-3">
                <label for="" class="form-label">Kode OTP:</label>
                <input type="text" class="form-control border border-grey border-2" v-model="otp" required><br>
            </div>
    
            <div class="mb-3">
                <label for="" class="form-label">Password:</label>
                <input type="password" class="form-control border border-grey border-2" v-model="password" required><br>
            </div>
            <div class="mb-3">
                <label for="" class="form-label">Confirmation Password:</label>
                <input type="password" class="form-control border border-grey border-2" v-model="password2" required><br>
            </div>
    
            <div class="mb-3">
                <button type="submit" :disabled="!isPasswordsEquals" class="btn btn-primary w-100">Forgot Password</button>
            </div>
        </form><br>
    </div>
</template>

<script setup>
import { ref, watch, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const auth = inject('$auth');

const otp = ref('');
const password = ref('');
const password2 = ref('');

if (auth.getToken() !== null) {
    router.replace({ path: '/' });
}

const token = route.query.token;

const isPasswordsEquals = computed(() => {
    return (password.value !== '' && password.value === password2.value)
})

async function resetPassword() {
    const formData = {
        otp: otp.value,
        newPassword: password.value
    }
    const bodyData = JSON.stringify(formData);

    try {
        const response = await fetch(`http://localhost:8000/api/v1/account/reset-pass?token=${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyData
})

        if (response.ok) {
            const responseData = await response.json();
            const message = responseData.message;
            alert(message);
        } else {
            alert('Permintaan gagal diproses, cek kembali otp anda');
        }
    } catch (error) {
        console.error('Error:', error)
        alert('Ada kesalahan. Silakan coba lagi.')
    }
}
</script>

<style scoped>
#reset-form-container {
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
</style>