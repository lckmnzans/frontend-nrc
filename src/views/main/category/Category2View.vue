<template>
    <div class="tab-container">
        <Tab :category="1" :category-id="`2`"/>
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
    margin-top:0;
    height: 40vh;
}

.tab-content {
    flex-grow: 1;
}
</style>