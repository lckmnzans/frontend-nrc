<template>
    <div class="tab-navigation">
        <ul :class="{ 'no-left-space': !hasLeftSpace }">
            <li v-for="(subcategory, index) in subcategories" :key="index" class="tab-item-wrapper">
                <router-link 
                    :to="`/category/${categoryId}/${subcategory.subcategory_id}`"
                    class="tab-item"
                    :class="{ active: this.$route.path === `/category/${categoryId}/${subcategory.subcategory_id}` }"
                >
                    {{ subcategory.subcategory_name }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        category: Number,
        categoryId: String,
        hasLeftSpace: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.getData(this.category);
    },
    data() {
        return {
            subcategories: []
        };
    },
    methods: {
        async getData(category) {
            const res = await fetch('docType.json');
            const data = await res.json();

            this.subcategories = data.category[category].subcategory;
        }
    }
};
</script>

<style lang="scss" scoped>
.tab-navigation {
    display: flex;
    flex-direction: column;
    height: 10vh;
    width: 100%;

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
