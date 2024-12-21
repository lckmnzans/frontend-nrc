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
                            <option value="A04">CV</option>
                            <option value="A05">Keuangan</option>
                            <option value="A02">Kontrak</option>
                            <option value="A01">Legalitas</option>
                            <option value="A08">Pemegang Saham</option>
                            <option value="A07">Pengurus</option>
                            <option value="B01">Surat Masuk</option>
                            <option value="A03">Tenaga Ahli</option>
                        </select>
                    </div>
                </form>
                <PdfForm
                :disabled-state="isFormEmpty"
                @update:local-preview="localPreview = $event"
                @submit="handleSubmit"
                />
            </div>
            <PreviewPdf :pdf="localPreview"/>
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
            localPreview: null,
            selectedFile: null,
            docType: '',
            docData: {}
        };
    },
    methods: {
        async handleSubmit(file) {
            this.uploadFile(file);
        },
        async uploadFile(file) {
            if (!file) {
                alert('Tidak ada file yang dipilih.');
                return;
            }

            this.$axios(api.upload(file, this.docType))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    const docData = {
                        docName: body.data.file.filename,
                        docType: this.docType,
                    };
                    this.selectedFile = null;
                    console.log('File berhasil diunggah');
                    this.uploadDocData(docData);
                } else {
                    console.log('File gagal diunggah');
                }
            })
            .catch(error => {
                console.log('Permintaan tidak bisa diproses');
            })
        },
        async uploadDocData(docData) {
            this.$axios(api.uploadDocData(docData, this.docType))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    console.log('docData berhasil disimpan');
                    console.log(body);
                } else {
                    const body = response.data;
                    console.log('docData gagal disimpan. Error: ' + body.message);
                }
            })
            .catch(error => {
                console.log('Permintaan tidak bisa diproses. Error: ' + error);
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
}
</style>