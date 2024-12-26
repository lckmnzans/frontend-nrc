<template>
    <router-view />
</template>

<script>
import { mapState } from 'pinia';
import { usePageStore, useDocumentsTypeStore } from '@/store';
export default {
    inject: ['$auth', '$axios'],
    computed: {
        ...mapState(usePageStore, ['pages']),
        ...mapState(useDocumentsTypeStore, ['documents'])
    },
    created() {
        this.fetchDocumentsSchema();
        const token = this.$auth.getToken();
        const tokenAge = localStorage.getItem('tokenAge');

        if (!token) {
            console.log('Anda belum login');
            this.$router.replace({ name: 'login' });
            return;
        } else {
            if (tokenAge <= Date.now()) {
                console.log('Token anda sudah habis masa waktu');
                this.$auth.logout();
                this.$router.replace({ name: 'login' });
                return;
            }
            this.$router.replace({ name: 'home' });
            this.token = token;
        }
    },
    data() {
        return {
            token:''
        }
    },
    methods: {
        async fetchDocumentsSchema() {
            const res = await fetch('docSchema.json');
            const data = await res.json();
            const docCategories = await data.categories;

            for (let categoryId in docCategories) {
                this.pages.push({
                    page: Number.parseInt(categoryId) + 1,
                    content: docCategories[categoryId].category_name
                });
                const subDocCategories = docCategories[categoryId].subcategories;
                for (let subCategoryId in subDocCategories) {
                    this.documents.push({
                        docTypeId: subDocCategories[subCategoryId].subcategory_id,
                        docTypeName: subDocCategories[subCategoryId].subcategory_name
                    });
                };
            };
            return;
        }
    }
}
</script>
<style lang="scss">
#app {
    margin: 0;
    height: 100vh;
    background-image: url('assets/background.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

:root {
    --primary: #3498db;
    --grey: #64748b;
    --dark: #1e293b;
    --dark-alt: #334155;
    --light: #f1f5f9;
    --sidebar-width: 300px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>