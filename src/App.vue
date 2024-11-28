<template>
    <router-view></router-view>
</template>

<script>
export default {
    inject: ['$auth'],
    created() {
        const token = this.$auth.getToken();

        if (!token) {
            console.log('Anda belum login');
            this.$router.replace({ path:'/login' });
            return;
        } else {
            this.$router.replace({ path:'/dashboard' });
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
<style>
#app {
  margin: 0;
  height: 100vh;
  background-image: url('assets/background.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>