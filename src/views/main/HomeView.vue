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
            <div class="mb-3">
                <label for="" class="form-label">Jenis Dokumen</label>
                <select class="form-select" v-model="docType">
                    <option value="">Pilih jenis dokumen</option>
                    <option value="cv">CV</option>
                    <option value="keuangan">Keuangan</option>
                    <option value="kontrak">Kontrak</option>
                    <option value="legalitas">Legalitas</option>
                    <option value="pemegang_saham">Pemegang Saham</option>
                    <option value="pengurus">Pengurus</option>
                    <option value="surat_masuk">Surat Masuk</option>
                    <option value="tenaga_ahli">Tenaga Ahli</option>
                </select>
            </div>
            <div>
                <button type="submit" class="btn btn-primary btn-sm" :disabled="!selectedFile">Upload</button>
            </div>
        </form>
    </div>
    <div class="preview-form" v-show="localPreview">
        <h4>Preview PDF</h4>
        <vue-pdf-app class="pdf" :pdf="localPreview" />
    </div>
    </div>
</template>
<script>
import VuePdfApp from 'vue3-pdf-app';
import api from '../../api/document.api';
export default {
    components: {
        VuePdfApp
    },
    inject: ['$axios'],
    data() {
        return {
            selectedFile: null,
            docType: '',
            localPreview: null
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

            this.$axios(api.upload(this.selectedFile, this.docType))
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
        width: 50vw;
        height: 80vh;
    }
}
</style>
