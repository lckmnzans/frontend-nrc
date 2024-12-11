<template>
    <div class="tab-container">
        <div class="tab-bar">
            <router-link to="/category/3/C01" class="tab-item" :class="{ active: this.$route.path === '/category/3/C01'}">Sertifikat</router-link>
            <router-link to="/category/3/C02" class="tab-item" :class="{ active: this.$route.path === '/category/3/C02'}">SPJB</router-link>
        </div>
        <div class="tab-content">
            <p>Ini adalah content </p>
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