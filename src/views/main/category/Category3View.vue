<template>
    <div class="tab-container">
        <TabBar :pages="pages" :has-left-space="true" :route-link-builder="routeLinkBuilder" />
        <div class="tab-content">
            <router-view />
        </div>
    </div>
</template>
<script>
import TabBar from '@/components/TabBar.vue';
import { mapState, mapActions } from 'pinia';
import { usePageStore } from '@/store';
export default {
    components: {
        TabBar
    },
    // computed: {
    //     ...mapState(usePageStore, ['getSubPagesByPage'])
    // },
    created() {
        this.setPageTitle('Dokumen Kepemilikan Tanah');
        const pages = this.getSubPagesByPage(2);
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
            return `/category/3/${target}`;
        },
        getSubPagesByPage(page) {
            const pages = JSON.parse(localStorage.getItem('subpages'));
            return pages[page];
        },
        ...mapActions(usePageStore, ['setPageTitle'])
    }
}
</script>
<style lang="scss" scoped>
.tab-container {
    display: flex;
    flex-direction: column;
    height: auto;
    
    .tab-navigation {
        top:0;
        position: sticky;
        overflow-y: hidden;
        overflow-x: auto;
        z-index: 99;
    }

    .tab-content {
        height:auto;
        flex-grow: 1;
    }
}
</style>