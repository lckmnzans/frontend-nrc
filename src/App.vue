<template>
    <router-view />
</template>

<script>
import api from '@/api/account.api';
import { mapState } from 'pinia';
import { usePageStore, useDocumentsTypeStore, useDocumentsSchemaStore } from '@/store';
export default {
    computed: {
        ...mapState(usePageStore, ['pages','subPages']),
        ...mapState(useDocumentsTypeStore, ['documents']),
        ...mapState(useDocumentsSchemaStore, ['formsData'])
    },
    created() {
        this.fetchDocumentsSchema();
    },
    beforeUpdate() {
        this.fetchDocumentsSchema();
    },
    methods: {
        async fetchDocumentsSchema() {
            const res = await fetch(`${api.ApiHost}/api/v1/document`);
            const data = await res.json();
            const categories = await data.categories;

            for (let categoryId in categories) {
                this.pages.push({
                    page: Number.parseInt(categoryId) + 1,
                    content: categories[categoryId].category_name
                });

                const subCategories = categories[categoryId].subcategories;
                const subPages = [];
                for (let subCategoryId in subCategories) {
                    this.documents.push({
                        docTypeId: subCategories[subCategoryId].subcategory_id,
                        docTypeName: subCategories[subCategoryId].subcategory_name
                    });
                    subPages.push({
                        subPageId: subCategories[subCategoryId].subcategory_id,
                        subPageTitle: subCategories[subCategoryId].subcategory_name
                    });
                    this.formsData.push({ 
                        formId: subCategories[subCategoryId].subcategory_id,
                        formSchema: subCategories[subCategoryId].form_schema
                    });
                };
                this.subPages.push(subPages);
            };
            localStorage.setItem('documents-schema', JSON.stringify(this.formsData));
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
    // overflow-x: auto;
}

:root {
    --primary: #3498db;
    --grey: #64748b;
    --green: rgb(92, 194, 46);
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