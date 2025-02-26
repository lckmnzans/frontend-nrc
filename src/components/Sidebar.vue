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
            <router-link class="button" :to="`/`" active-class="active">
                <span class="material-icons">home</span>
                <span class="text">Home</span>
            </router-link>
            <a class="button" @click.prevent="toggleSubmenu" style="cursor: context-menu;" v-if="!isRegularUser">
                <span class="material-icons">list_alt</span>
                <span class="text">Kategori</span>
                <span class="material-icons submenu-icon">
                    {{ isSubmenuVisible ? 'expand_less' : 'expand_more' }}
                </span>
            </a>
            <ul v-if="isSubmenuVisible && !isRegularUser" class="submenu">
                <li v-for="(page, index) in pages" :key="index">
                    <router-link class="button submenu-item" :to="`/category/${page.page}`" active-class="active">
                        <span class="material-icons">label_important</span>
                        <span class="text">{{ page.content }}</span>
                    </router-link>
                </li>
            </ul>
            <router-link v-if="isSuperadmin" class="button" :to="`/accounts`" active-class="active">
                <span class="material-icons">groups</span>
                <span class="text">Accounts</span>
            </router-link>
        </div>
        <div class="flex"></div>
        <div class="menu">
            <router-link class="button" to="/login" @click="logout" id="btn-logout">
                <span class="material-icons">logout</span>
                <span class="text">Keluar</span>
            </router-link>
        </div>
    </aside>
</template>
<script>
import { mapActions } from 'pinia';
import { useUserStore } from '@/store/userStore';
export default {
    inject: ['$auth'],
    emits: ['sidebarExpanded'],
    props: {
        pages: {
            type: Array,
            required: true
        },
        documents: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            isSubmenuVisible: localStorage.getItem('isSubmenuExpanded') === 'true',
            isExpanded: localStorage.getItem('isMenuExpanded') === 'true',
            isSuperadmin: localStorage.getItem('role') === 'superadmin',
            isRegularUser: localStorage.getItem('role') === 'user',
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
            this.clear();
        },
        ...mapActions(useUserStore, {
            clear: 'clear'
        })
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
    left:0;
    position: sticky;
    z-index: 998;

    background-image: linear-gradient(var(--light), var(--primary-alt-3));
    color: var(--dark);

    transition: 0.2s ease-out;

    .flex {
        flex: 1 1 0;
    }

    .logo {
        margin-bottom: 1rem;

        img {
            width: 2rem;
            transition: 0.2s ease-in;
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
                color: var(--dark);
                transition: 0.2s ease-out;
            }

            &:hover {
                .material-icons {
                    color: var(--primary-alt-3);
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
                color: var(--dark);
                transition: 0.2s ease-out;
            }

            .text {
                color: var(--dark);
                transition: 0.2s ease-out;
            }

            &:hover, &.active {
                background-color: var(--primary-alt-6);

                .material-icons, .text {
                    color: var(--light);
                }
            }

            &.active {
                border-right: 1px solid var(--primary);
                background-image: linear-gradient(to left, var(--primary), var(--primary-alt-3));
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

    #btn-logout {
        background-color: var(--secondary);
        border: 1px solid var(--secondary);

        .material-icons, .text {
            color: var(--light);
        }

        &:hover {
            border-right: 1px solid var(--grey);
            border-bottom: 1px solid var(--grey);
        }
    }

    &.is-expanded {
        width: var(--sidebar-width);

        .logo img {
            width: 100px;
            transition: 0.2s ease-out;
        }

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

        #btn-logout {
            margin: 0 1rem;
        }
    }

    @media (max-width: 768px) {
        position: fixed;
        z-index: 998;
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