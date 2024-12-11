<template>
    <div class="dashboard">
        <Sidebar></Sidebar>
        <div class="content">
            <div class="top-bar">
                Top Bar
                <div class="top-bar-right">
                    <button class="button" @click="goToProfile"><span class="material-icons" id="btn-profile">account_circle</span></button>
                </div>
            </div>
            <main>
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
    },
    methods: {
        show() {
            alert('Hello World');
        },
        goToProfile() {
            this.$router.push({ path: '/profile' });
        }
    }
}
</script>
<style lang="scss" scoped>
.dashboard {
    display: flex;
    height: 100vh;
    background-color: var(--light);

    Sidebar {
        flex: 0 0 auto;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: var(--primary);
            color: var(--light);
            padding: 1rem 2rem;

            .top-bar-right {
                display: flex;
                justify-content: end;

                button {
                    border: none;
                    appearance: none;
                    outline: none;
                    background: none;
                    color: var(--light);
                }

                #btn-profile {
                    font-size: 2rem;
                }   
            }
        }

        main {
            flex: 1 1 0;
            overflow-y: auto;

            @media (max-width: 768px) {
                padding-left: 6rem;
            }
        }
    }
}
</style>