<template>
    <div class="tab-container">
        <div class="tab-bar">
            <Tab :category="0" :category-id="`1`" :has-left-space="true" />
        </div>
        <div class="tab-content">
            <router-view />
        </div>
    </div>
</template>
<script>
import Tab from '@/components/Tab.vue';
export default {
    components: {
        Tab
    }
}
</script>
<style lang="scss" scoped>
.tab-container {
    display: flex;
    flex-direction: column;
    height: 40vh;

    .tab-content {
        flex-grow: 1;
    }
}
</style>