<template>
    <div class="main-content">
        <div class="form-group">
            <div>
                <h4>Unggah Dokumen PDF</h4>
                <form>
                    <div class="mb-3">
                        <label for="file" class="form-label">Jenis Dokumen</label>
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
                </form>
                <PdfForm
                :disabled-state="isFormEmpty"
                @update:local-preview="localPreview = $event"
                @update:file-name="filename = $event"
                @submit="handleSubmit"
                />
            </div>
            <PreviewPdf :pdf="localPreview" :filename="filename"/>
        </div>
    </div>
</template>
<script>
import PdfForm from '@/components/PdfForm.vue';
import PreviewPdf from '@/components/PreviewPdf.vue';
import api from '@/api/document.api';
export default {
    components: {
        PdfForm,
        PreviewPdf
    },
    inject: ['$axios'],
    computed: {
        isFormEmpty() {
            return this.docType === '';
        }
    },
    data() {
        return {
            filename: '',
            localPreview: null,
            selectedFile: null,
            docType: ''
        };
    },
    methods: {
        handleSubmit(file) {
            if (!file) {
                alert('Tidak ada file yang dipilih.');
                return;
            }

            this.$axios(api.upload(file, this.docType))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    alert('File berhasil diunggah');
                    this.selectedFile = null;
                } else {
                    alert('Permintaan gagal diproses server dan file gagal diunggah');
                }
            })
            .catch(error => {
                alert('Terjadi kesalahan dalam mengirim permintaan.')
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

    .preview-pdf {
        width: 40vw;
        height: 80vh;
    }
}
</style>