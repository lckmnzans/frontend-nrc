<template>
    <div class="tab-container">
        <div class="tab-bar">
            <router-link to="/category/1/A01" class="tab-item" :class="{ active: this.$route.path === '/category/1/A01'}">Legalitas</router-link>
            <router-link to="/category/1/A02" class="tab-item" :class="{ active: this.$route.path === '/category/1/A02'}">Kontrak</router-link>
            <router-link to="/category/1/A03" class="tab-item" :class="{ active: this.$route.path === '/category/1/A03'}">Tenaga Ahli</router-link>
            <router-link to="/category/1/A04" class="tab-item" :class="{ active: this.$route.path === '/category/1/A04'}">CV</router-link>
            <router-link to="/category/1/A05" class="tab-item" :class="{ active: this.$route.path === '/category/1/A05'}">Keuangan</router-link>
            <router-link to="/category/1/A06" class="tab-item" :class="{ active: this.$route.path === '/category/1/A06'}">Proyek</router-link>
            <router-link to="/category/1/A07" class="tab-item" :class="{ active: this.$route.path === '/category/1/A07'}">Pengurus</router-link>
            <router-link to="/category/1/A08" class="tab-item" :class="{ active: this.$route.path === '/category/1/A08'}">Pemegang Saham</router-link>
            <router-link to="/category/1/A09" class="tab-item" :class="{ active: this.$route.path === '/category/1/A09'}">Peralatan</router-link>
            <router-link to="/category/1/A10" class="tab-item" :class="{ active: this.$route.path === '/category/1/A10'}">Lain-lain</router-link>
        </div>
        <div class="tab-content">
            <router-view />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.tab-container {
    display: flex;
    flex-direction: column;
    height: 40vh;
}

.tab-bar {
    display: flex;
    background-color: var(--primary);
    border-bottom: 1px solid #ddd;
    padding-top: 1rem;
}

.tab-item {
    text-decoration: none;
    color: var(--dark);
    background-color: var(--light);
    padding: 10px 20px;
    border-radius: 5px 5px 0 0;
    transition: background-color 0.2s, color 0.2s;

    &.active {
        background-color: #1b3046;
        color: #fff;
    }
}

.tab-item:hover {
    background-color: #e2e6ea;
}

.tab-content {
    padding: 20px;
    flex-grow: 1;
}
</style>