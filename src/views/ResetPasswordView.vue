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

<script>
import api from '@/api/account.api';
export default {
    props: {
        token: {
            type: String,
            required: true
        }
    },
    inject: ['$auth'],
    computed: {
        formValid() {
            return this.otp && this.password && this.password2 && this.isPasswordsEquals();
        }
    },
    data() {
        return {
            otp: '',
            password: '',
            password2: '' 
        }
    },
    created() {
        const token = this.$auth.getToken();
        if (token !== null) {
            this.$router.replace({ name: 'home' });
        }
    },
    methods: {
        isPasswordsEquals() {
            return this.password === this.password2;
        },
        async resetPassword() {
            const userData = {
                otp: this.otp,
                newPassword: this.password
            }
            this.axios(api.resetPassword(userData, this.token))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    alert(body.message);
                } else {
                    const body = response.data;
                    alert('Permintaan gagal diproses. Cek kembali OTP anda!');
                }
            })
            .catch(err => {
                alert('Ada kesalahan. Silahkan coba lagi nanti.');
            });
        }
    }
}
// <!-- <script setup>
// import { ref, computed, inject } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
// import api from '@/api/account.api';
// const route = useRoute();
// const router = useRouter();
// const auth = inject('$auth');
// const axios = inject('$axios');

// const otp = ref('');
// const password = ref('');
// const password2 = ref('');

// if (auth.getToken() !== null) {
//     router.replace({ name: 'home' });
// }

// const token = route.query.token;

// const isPasswordsEquals = computed(() => {
//     return (password.value !== '' && password.value === password2.value)
// })

// async function resetPassword() {
//     const userdata = {
//         otp: otp.value,
//         newPassword: otp.newPassword
//     }
//     axios(api.resetPassword(userdata, token))
//     .then(response => {
//         if (response.status = 200) {
//             const body = response.data;
//             alert(body.message);
//         } else {
//             alert('Permintaan gagal diproses, cek kembali otp anda');
//         }
//     })
//     .catch(error => {
//         console.log(error);
//         alert('Ada kesalahan. Silahkan coba lagi nanti.');
//     })
// } -->
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