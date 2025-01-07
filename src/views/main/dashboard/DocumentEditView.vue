<template>
    <div class="edit-container">
        <component v-if="docType" :is="getDocComponent(docType)" :doc-id="docId" :mode="'edit'"/>
    </div>
</template>
<script>
import FormA01View from '@/views/main/category/forms/FormA01View.vue';
import FormA02View from '@/views/main/category/forms/FormA02View.vue';
import FormA03View from '@/views/main/category/forms/FormA03View.vue';
import FormA04View from '@/views/main/category/forms/FormA04View.vue';
import FormA05View from '@/views/main/category/forms/FormA05View.vue';
import FormA06View from '@/views/main/category/forms/FormA06View.vue';
import FormA07View from '@/views/main/category/forms/FormA07View.vue';
import FormA08View from '@/views/main/category/forms/FormA08View.vue';
import FormA09View from '@/views/main/category/forms/FormA09View.vue';
import FormA10View from '@/views/main/category/forms/FormA10View.vue';
import FormB01View from '@/views/main/category/forms/FormB01View.vue';
import FormB02View from '@/views/main/category/forms/FormB02View.vue';
import FormC01View from '@/views/main/category/forms/FormC01View.vue';
import FormC02View from '@/views/main/category/forms/FormC02View.vue';

export default {
    components: {
        FormA01View, FormA02View, FormA03View, FormA04View, FormA05View, FormA06View, FormA07View, FormA08View, FormA09View, FormA10View, FormB01View, FormB02View, FormC01View, FormC02View
    },
    props: {
        docType: String,
        docId: String
    },
    data() {
        return {
            loading: true,
            documentData: null,
        }
    },
    methods: {
        getDocComponent(docType) {
            switch (docType) {
                case 'A01':
                    return 'FormA01View';
                case 'A02':
                    return 'FormA02View';
                case 'A03':
                    return 'FormA03View';
                case 'A04':
                    return 'FormA04View';
                case 'A05':
                    return 'FormA05View';
                case 'A06':
                    return 'FormA06View';
                case 'A07':
                    return 'FormA07View';
                case 'A08':
                    return 'FormA08View';
                case 'A09':
                    return 'FormA09View';
                case 'A10':
                    return 'FormA10View';
                case 'B01':
                    return 'FormB01View';
                case 'B02':
                    return 'FormB02View';
                case 'C01':
                    return 'FormC01View';
                case 'C02':
                    return 'FormC02View';
                default:
                    return null;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>