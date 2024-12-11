<template>
    <div class="preview-form" v-show="pdf">
        <h4>Preview PDF</h4>
        <vue-pdf-app class="pdf" :pdf="pdf"></vue-pdf-app>
    </div>
</template>
<script>
import VuePdfApp from 'vue3-pdf-app';
import "vue3-pdf-app/dist/icons/main.css";
export default {
    components: {
        VuePdfApp
    },
    props: {
        pdf: String
    }
}
</script>