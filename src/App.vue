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
    async created() {
        await this.fetchDocumentsSchema();
    },
    beforeUpdate() {
        this.fetchDocumentsSchema();
    },
    methods: {
        async fetchDocumentsSchema() {
            // const res = this.axios.get(`${api.ApiHost}/api/v1/document`, { responseType: 'json' });
            const res = this.axios.get('/docSchema.json', { responseType: 'json' });
            const data = (await res).data;
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
            localStorage.setItem('documents-type', JSON.stringify(this.documents))
            localStorage.setItem('pages', JSON.stringify(this.pages));
            localStorage.setItem('subpages', JSON.stringify(this.subPages));
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
    --primary: rgba(0, 39, 176, 1);
    --primary-alt-6: rgba(0, 39, 176, 0.6);
    --primary-alt-3: rgba(0, 39, 176, 0.3);
    --secondary: rgba(207, 52, 32, 1);
    --secondary-alt-6: rgba(207, 52, 32, 0.6);
    --secondary-alt-3: rgba(207, 52, 32, 0.3);
    --grey: #64748b;
    --dark: rgba(30, 30, 30, 1);
    --dark-alt: rgba(44, 38, 36, 1);
    --light: rgba(248, 251, 252, 1);
    --sidebar-width: 300px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>