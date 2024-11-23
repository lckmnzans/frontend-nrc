<template>
    <h4>Ini adalah halaman dashboard</h4>
</template>
<script>
export default {
    inject: ['$auth'],
    created() {
        const token = this.$auth.getToken();

        if (!token) {
            alert('Anda belum punya akses ke halaman ini')
            this.$router.push({ path: '/login' });
            return;
        } else {
            this.token = token;
        }
    },
    data() {
        return {
            token: '',
        }
    }
}
</script>