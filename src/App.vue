<template>
    <Login :form-filled="showValue"></Login>
</template>

<script>
import Login from './components/Login.vue';

export default {
    components: {
        Login
    },
    created() {
        this.getLogin();
    },
    data() {
        return {
            token:''
        }
    },
    methods: {
        showValue(object) {
            console.log(object);
        },
        getLogin() {
            let token = localStorage.getItem('accessToken');

            if (token) {
                console.log(`Your access token : ${token}`);
                this.token = token;
            }
        }
    }
}
</script>