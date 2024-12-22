<template>
    <div class="tab-container">
        <Tab :category="0" :category-id="`1`" :has-left-space="true" />
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

.tab-navigation {
    top:0;
    position: sticky;
}

.tab-content {
    height:auto;
    flex-grow: 1;
}
</style>