<template>
    <aside :class="`${isExpanded ? 'is-expanded' : ''}`">
        <div class="logo">
            <img src="../assets/logo.png" alt="logo">
        </div>
        <div class="menu-toggle-wrap">
            <button class="menu-toggle menu-icon" @click.prevent="toggleMenu">
                <span class="material-icons">keyboard_double_arrow_right</span>
            </button>
        </div>

        <h3>Menu Dashboard</h3>
        <div class="menu">
            <router-link class="button" to="/home">
                <span class="material-icons">home</span>
                <span class="text">Home</span>
            </router-link>
            <router-link class="button" to="/category">
                <span class="material-icons">list_alt</span>
                <span class="text">Category</span>
            </router-link>
            <router-link class="button" to="/accounts">
                <span class="material-icons">groups</span>
                <span class="text">Accounts</span>
            </router-link>
        </div>
        <div class="flex"></div>
        <div class="menu">
                <router-link class="button" to="/settings">
                    <span class="material-icons">settings</span>
                    <span class="text">Setting</span>
                </router-link>
            </div>
    </aside>
</template>

<script setup>
import { ref } from 'vue';

const isExpanded = ref(localStorage.getItem('isMenuExpanded') === "true");

const toggleMenu = () => {
    isExpanded.value = !isExpanded.value;

    localStorage.setItem('isMenuExpanded', isExpanded.value);
}
</script>

<style lang="scss" scoped>
aside {
    display: flex;
    flex-direction: column;
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
    }

    &.is-expanded {
        width: var(--sidebar-width);

        .menu-toggle-wrap {
            top: -3rem;

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