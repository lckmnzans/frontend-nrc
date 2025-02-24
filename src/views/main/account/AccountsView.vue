<template>
    <div class="main-container" >
        <router-view />
    </div>
</template>
<script>
import { mapActions } from 'pinia';
import { usePageStore } from '@/store';
export default {
    created() {
        // this.// setPageTitle('Manajemen Akun');
    },
    methods: {
        ...mapActions(usePageStore, ['setPageTitle'])
    }
}
</script>
<style lang="scss" scoped>
.main-container {
    padding: 2rem;
}
</style>