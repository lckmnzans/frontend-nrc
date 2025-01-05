<template>
    <div class="preview-pdf" v-show="pdf">
        <vue-pdf-app class="pdf" theme="light" :config="config" :pdf="pdf"></vue-pdf-app>
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
    },
    data() {
        return {
            config: {
                toolbar: {
                    toolbarViewerRight: {
                        print: false,
                        download: false,
                        viewBookmark: false
                    }
                }
            }
        }
    }
}
</script>
<style scoped>
.preview-pdf {
    width: 768px;
    height: 60vh;
    top:3rem;
    position: sticky;
}
</style>