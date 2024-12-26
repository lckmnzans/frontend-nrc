<template>
    <aside :class="`${isExpanded ? 'is-expanded' : ''}`">
        <div class="logo">
            <img src="../../public/nrca.png" alt="logo">
        </div>
        <div class="menu-toggle-wrap">
            <button class="menu-toggle menu-icon" @click.prevent="toggleMenu">
                <span class="material-icons">keyboard_double_arrow_right</span>
            </button>
        </div>

        <h3>Menu Dashboard</h3>
        <div class="menu">
            <router-link class="button" to="/">
                <span class="material-icons">home</span>
                <span class="text">Home</span>
            </router-link>
            <a class="button" @click.prevent="toggleSubmenu" style="cursor: context-menu;">
                <span class="material-icons">list_alt</span>
                <span class="text">Kategori</span>
                <span class="material-icons submenu-icon">
                    {{ isSubmenuVisible ? 'expand_less' : 'expand_more' }}
                </span>
            </a>
            <ul v-if="isSubmenuVisible" class="submenu">
                <li v-for="page in pages" :key="page.page">
                    <router-link class="button submenu-item" :to="`/category/${page.page}`">
                        <span class="material-icons">label_important</span>
                        <span class="text">{{ page.content }}</span>
                    </router-link>
                </li>
            </ul>
            <router-link v-if="isSuperadmin" class="button" to="/accounts">
                <span class="material-icons">groups</span>
                <span class="text">Accounts</span>
            </router-link>
        </div>
        <div class="flex"></div>
        <div class="menu">
            <router-link class="button" to="/test">
                <span class="material-icons">adb</span>
                <span class="text">Test</span>
            </router-link>
            <router-link class="button" to="/login" @click="logout">
                <span class="material-icons">logout</span>
                <span class="text">Keluar</span>
            </router-link>
        </div>
    </aside>
</template>
<script>
import router from '@/router';
import { mapState } from 'pinia';
import { usePageStore, useDocumentsTypeStore } from '@/store';

export default {
    inject: ['$auth'],
    emits: ['sidebarExpanded'],
    computed: {
        ...mapState(usePageStore, ['pages']),
        ...mapState(useDocumentsTypeStore, ['documents'])
    },
    data() {
        return {
            isSubmenuVisible: localStorage.getItem('isSubmenuExpanded') === 'true',
            isExpanded: localStorage.getItem('isMenuExpanded') === 'true',
            isSuperadmin: localStorage.getItem('role') === 'superadmin'
        }
    },
    methods: {
        toggleMenu() {
            this.isExpanded = !this.isExpanded;
            this.$emit('sidebarExpanded', this.isExpanded);

            localStorage.setItem('isMenuExpanded', this.isExpanded);
        },
        toggleSubmenu() {
            this.isSubmenuVisible = !this.isSubmenuVisible;

            localStorage.setItem('isSubmenuExpanded', this.isSubmenuVisible);
        },
        logout() {
            this.$auth.logout();
            router.replace({ name: 'login' });
        }
    }
}
</script>

<style lang="scss" scoped>
aside {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: calc(2rem + 32px);
    min-height: 100vh;
    overflow: hidden;
    padding: 1rem;

    background-color: var(--dark);
    color: var(--light);

    transition: 0.2s ease-out;

    .flex {
        flex: 1 1 0;
    }

    .logo {
        margin-bottom: 1rem;

        img {
            width: 2rem;
        }
    }

    .menu-toggle-wrap {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;

        position: relative;
        top: 0;
        transition:  0.2s ease-out;

        .menu-toggle {
            transition: 0.2s ease-out;

            .material-icons {
                font-size: 2rem;
                color: var(--light);
                transition: 0.2s ease-out;
            }

            &:hover {
                .material-icons {
                    color: var(--primary);
                    transform: translateX(0.5rem);
                }
            }
        }
    }

    h3, .button .text {
        opacity: 0;
        transition: 0.3s ease-out;
    }

    h3 {
        color: var(--grey);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
    }

    .menu {
        margin: 0 -1rem;

        .button {
            display: flex;
            align-items: center;
            text-decoration: none;

            padding: 0.5rem 1rem;
            transition: 0.2s ease-out;

            .material-icons {
                font-size: 2rem;
                color: var(--light);
                transition: 0.2s ease-out;
            }

            .text {
                color: var(--light);
                transition: 0.2s ease-out;
            }

            &:hover, &.router-link-exact-active {
                background-color: var(--dark-alt);

                .material-icons, .text {
                    color: var(--primary);
                }
            }

            &.router-link-exact-active {
                border-right: 5px solid var(--primary);
            }
        }

        .submenu {
            list-style-type: none;
            margin: 0 0 0 -2rem;

            a {
                font-size: 0.5rem;

                .text {
                    opacity: 0;
                }
            }
        }
    }

    &.is-expanded {
        width: var(--sidebar-width);

        .menu-toggle-wrap {
            top: -3.5rem;

            .menu-toggle {
                transform: rotate(-180deg);
            }
        }

        h3, .button .text {
            opacity: 1;
        }

        .button {
            .material-icons {
                margin-right: 2rem;
            }
        }

        .submenu a {
            font-size: 1rem;

            .text {
                opacity: 1;
                transition: 0.2s ease-out;
            }
        }
    }

    @media (max-width: 768px) {
        position: fixed;
        z-index: 99;
    }
}

.menu-icon {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
}

</style>