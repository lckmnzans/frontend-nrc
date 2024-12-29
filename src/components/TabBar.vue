<template>
    <div class="tab-navigation">
        <ul :class="{ 'no-left-space': !hasLeftSpace }">
            <li v-for="(page, index) in pages" :key="index" class="tab-item-wrapper">
                <router-link 
                    :to="routeLinkBuilder(page.pageId)"
                    class="tab-item"
                    :class="{ active: this.$route.path === `${routeLinkBuilder(page.pageId)}` }"
                >
                    {{ page.pageTitle }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        routeLinkBuilder: {
            type: Function,
            required: false
        },
        pages: {
            type: Array,
            required: false,
            validator(value) {
                return value.every(page => 
                    typeof page.pageId === 'string' && typeof page.pageTitle === 'string'
                );
            }
        },
        hasLeftSpace: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="scss" scoped>
.tab-navigation {
    display: flex;
    flex-direction: column;
    height: auto;

    ul {
        display: flex;
        list-style: none;
        background-color: var(--primary);
        border-bottom: 1px solid #ddd;
        margin: 0;
        padding: 1rem 0 0 1rem;

        &.no-left-space {
            padding: 1rem 0 0 0;
        }

        .tab-item-wrapper {
            flex-shrink: 0;
            margin-right: 0;
        }

        .tab-item {
            text-decoration: none;
            color: var(--light);
            background-color: var(--dark);
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
            transition: background-color 0.2s, color 0.2s;

            &.active {
                background-color: var(--light);
                color: var(--dark);
            }
        }

        .tab-item:hover {
            background-color: var(--light);
            color: var(--primary);
            mix-blend-mode: screen;
        }
    }
}
</style>
