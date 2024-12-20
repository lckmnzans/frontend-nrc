<template>
    <div class="tab-container">
        <Tab :category="2" :category-id="`3`" />
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
    height: auto;
}

.tab-content {
    flex-grow: 1;
}
</style>