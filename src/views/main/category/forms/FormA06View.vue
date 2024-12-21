<template>
    <div class="form-container">
        <div class="input-form">
            <h4>Formulir Proyek</h4>
            <PdfForm
            :disabled-state="false"
            @update:local-preview="localPreview = $event"
            @submit="handleSubmit"
            />
        </div>
        <PreviewPdf :pdf="localPreview" />
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
            return Object.values(this.docData).includes('');
        }
    },
    data() {
        return {
            localPreview: null,
            selectedFile: null,
            docType: 'A06',
            docData: {
                data: 'kosong'
            }
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
                    const data = {
                        docName: body.data.file.filename,
                        docType: this.docType,
                        ...this.docData
                    };
                    this.selectedFile = null;
                    console.log('File berhasil diunggah');
                    this.uploadDocData(data);
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
.form-container {
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-between;
    padding: 1.5rem;
}
</style>