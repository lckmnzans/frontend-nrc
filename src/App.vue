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
        }
    }
}
</script>