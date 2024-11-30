<template>
    <div class="dashboard">
        <Sidebar></Sidebar>
        <main>
            <h1>Dashboard Page</h1>
            <router-view />
        </main>
    </div>
</template>
<script>
import Sidebar from '@/components/Sidebar.vue';
export default {
    components: {
        Sidebar
    },
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
<style lang="scss">
.dashboard {
    display: flex;

    main {
        flex: 1 1 0;
        padding: 2rem;

        @media (max-width: 768px) {
            padding-left: 6rem;
        }
    }
}
</style>