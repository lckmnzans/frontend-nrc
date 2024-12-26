<template>
    <div class="tab-container">
        <Tab :category="category" :category-id="categoryId" :has-left-space="true" />
        <div class="tab-content">
            <div class="input-form">
                <h4>Formulir {{ currentPage.subcategoryName }}</h4>
                <Forms :form-id="currentPage.subcategoryId" :form-data="currentPage.formData" />
            </div>
        </div>
    </div>
</template>
<script>
import Tab from '@/components/Tab.vue';
import Forms from '@/components/Forms.vue';
export default {
    components: {
        Tab, Forms
    },
    created() {
    },
    data() {
        return {
            category: 2,
            categoryId: '3',
            pages: [],
            currentPage: {
                subcategoryId: '',
                subcategoryName: '',
                formData: []
            }
        }
    },
    methods: {
        async fetchPages() {
            const res = await fetch('docType.json');
            const data = await res.json();
            this.pages = data.category[2].subcategory;
        }
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