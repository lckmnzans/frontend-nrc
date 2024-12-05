<template>
    <router-view />
</template>

<script>
export default {
    inject: ['$auth'],
    created() {
        const token = this.$auth.getToken();
        const tokenAge = localStorage.getItem('tokenAge');

        if (!token) {
            console.log('Anda belum login');
            this.$router.replace({ name: 'login' });
            return;
        } else {
            if (tokenAge <= Date.now()) {
                console.log('Token anda sudah habis masa waktu');
                this.$router.replace({ name: 'login' });
                return;
            }
            this.$router.replace({ name: 'home' });
            this.token = token;
        }
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
    }
}
</script>
<style lang="scss">
#app {
    margin: 0;
    height: 100vh;
    background-image: url('assets/background.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

:root {
    --primary: #3498db;
    --grey: #64748b;
    --dark: #1e293b;
    --dark-alt: #334155;
    --light: #f1f5f9;
    --sidebar-width: 300px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>