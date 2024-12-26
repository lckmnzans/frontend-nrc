<template>
    <div class="tab-container">
        <Tab :pages="pages" :has-left-space="true" :route-link-builder="routeLinkBuilder" />
        <div class="tab-content">
            <router-view />
        </div>
    </div>
</template>
<script>
import Tab from '@/components/Tab.vue';
import { mapState } from 'pinia';
import { usePageStore } from '@/store';
export default {
    components: {
        Tab
    },
    computed: {
        ...mapState(usePageStore, ['getSubPagesByPage'])
    },
    created() {
        const pages = this.getSubPagesByPage(1);
        pages.forEach(page => this.pages.push({ 
            pageId: page.subPageId, pageTitle: page.subPageTitle })
        );
    },
    data() {
        return {
            pages: []
        }
    },
    methods: {
        routeLinkBuilder(target) {
            return `/category/2/${target}`;
        }
    }
}
</script>
<style lang="scss" scoped>
.tab-container {
    display: flex;
    flex-direction: column;
    height: auto;
}

.tab-navigation {
    top:0;
    position: sticky;
}

.tab-content {
    height: auto;
    flex-grow: 1;
}
</style>