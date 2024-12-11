<template>
    <div class="main-content">
        <div class="form-group">
            <UploadForm
            @update:selected-file="selectedFile = $event"
            @update:local-preview="localPreview = $event"
            @submit="handleSubmit"
            />
            <PreviewPdf :pdf="localPreview" />
        </div>
    </div>
</template>
<script>
import UploadForm from '@/components/UploadForm.vue';
import PreviewPdf from '@/components/PreviewPdf.vue';
import api from '@/api/document.api';
export default {
    components: {
        UploadForm,
        PreviewPdf
    },
    inject: ['$axios'],
    data() {
        return {
            selectedFile: null,
            docType: '',
            localPreview: null
        };
    },
    methods: {
        handleSubmit(file, docType) {
            if (!file) {
                alert('Tidak ada file yang dipilih.');
                return;
            }

            this.$axios(api.upload(file, docType))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    alert('File berhasil diunggah');
                    this.localPreview = null;
                    this.selectedFile = null;
                } else {
                    alert('Permintaan gagal diproses dan file gagal diunggah');
                }
            })
            .catch(error => {
                alert('Terjadi kesalahan saat mengupload file.')
            })
        }
    }
}
</script>
<style scoped>
.main-content {
    padding: 2rem;
}

.form-group {
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-between;

    .preview-form {
        width: 40vw;
        height: 80vh;
    }
}
</style>