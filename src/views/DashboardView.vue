<template>
    <div class="dashboard">
        <Sidebar></Sidebar>
        <div class="content">
            <div class="top-bar">
                Top Bar
            </div>
            <main>
                <h1>Dashboard Page</h1>
                <router-view />
            </main>
        </div>
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
            this.$router.push({ name: 'login' });
            return;
        } else {
            this.token = token;
        }
    },
    data() {
        return {
            token: ''
        }
    }
}
</script>
<style lang="scss">
.dashboard {
    display: flex;
    height: 100vh;

    Sidebar {
        flex: 0 0 auto;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .top-bar {
            flex: 0 0 auto;
            background-color: var(--primary);
            color: var(--light);
            padding: 1rem 2rem;
        }

        main {
            flex: 1 1 0;
            padding: 2rem;
            overflow-y: auto;

            @media (max-width: 768px) {
                padding-left: 6rem;
            }
        }
    }
}
</style>