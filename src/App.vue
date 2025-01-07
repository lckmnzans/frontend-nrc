<template>
    <router-view />
</template>

<script>
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
    methods: {
        async fetchDocumentsSchema() {
            const res = await fetch('docSchema.json');
            const data = await res.json();
            const docCategories = await data.categories;

            for (let categoryId in docCategories) {
                const subPagesItem = [];

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
                    subPagesItem.push({
                        subPageId: subDocCategories[subCategoryId].subcategory_id,
                        subPageTitle: subDocCategories[subCategoryId].subcategory_name
                    });
                    this.formsData.push({ 
                        formId: subDocCategories[subCategoryId].subcategory_id,
                        formSchema: subDocCategories[subCategoryId].form_schema
                    });
                };
                this.subPages.push(subPagesItem);
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
    overflow-x: auto;
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