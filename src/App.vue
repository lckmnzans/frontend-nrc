<template>
    <router-view></router-view>
</template>

<script>
export default {
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