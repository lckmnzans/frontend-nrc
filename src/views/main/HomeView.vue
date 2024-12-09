<template>
    <div class="form-group">
        <div class="upload-form">
        <h4>Upload Dokumen PDF</h4>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="file" class="form-label">Pilih Dokumen (PDF)</label>
                <input
                    type="file"
                    class="form-control"
                    id="file"
                    accept="application/pdf"
                    @change="handleFileUpload"
                />
            </div>
            <div v-if="selectedFile" class="mb-3">
                <p><strong>File yang dipilih:</strong> {{ selectedFile.name }}</p>
            </div>
            <div>
                <button type="submit" class="btn btn-primary btn-sm" :disabled="!selectedFile">Upload</button>
            </div>
        </form>
    </div>
    <div class="preview-form" v-if="localPreview">
        <h4>Preview PDF</h4>
        <PdfApp class="pdf" :pdf="localPreview" :config="config" />
    </div>
    </div>
</template>
<script>
import PdfApp from 'vue3-pdf-app';
import api from '../../api/document.api';
export default {
    components: {
        PdfApp
    },
    inject: ['$axios'],
    data() {
        return {
            selectedFile: null,
            localPreview: null,
            config: {
                toolbar: {
                    toolbarViewerLeft: true
                }
            }
        }
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.selectedFile = file;

                const reader = new FileReader();
                reader.onload = e => {
                    this.localPreview = e.target.result;
                }
                reader.readAsDataURL(file);
            } else {
                alert('Hanya dokumen PDF yang dapat diunggah');
                event.target.value = "";
                this.localPreview = null;
            }
        },
        handleSubmit() {
            if (!this.selectedFile) {
                alert('Tidak ada file yang dipilih.');
                return;
            }

            this.$axios(api.upload(this.selectedFile))
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
.form-group {
    display: flex;
    flex-direction: row;
    align-items: top;
    padding-top: 2rem;
    justify-content: space-between;

    .upload-form {
        display:flex;
        flex-direction: column;

    }

    .preview-form {
        width: 80vh;
        height: 80vh;
    }
}
</style>
