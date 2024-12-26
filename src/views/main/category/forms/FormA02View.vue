<template>
    <div class="form-container">
        <div class="input-form">
            <h4>Formulir Kontrak</h4>
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama Kontrak</label>
                    <input type="text" class="form-control" v-model="docData.namaKontrak"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Proyek</label>
                    <input type="text" class="form-control" v-model="docData.noProyek"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tanggal Kontrak</label>
                    <input type="date" class="form-control" v-model="docData.tglKontrak"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Kontrak</label>
                    <input type="text" class="form-control" v-model="docData.noKontrak"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pemberi Kerja</label>
                    <input type="text" class="form-control" v-model="docData.pemberiKerja"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jenis Dokumen</label>
                    <input type="text" class="form-control" v-model="docData.jenisDokumen"/> 
                </div>
                <div class="alert alert-info" role="alert">
                    Perhatian! Form yang dikosongkan akan diisi otomatis oleh sistem
                </div>
            </form>
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
    props: {
        docId: {
            type: String,
            required: false
        },
        filename: {
            type: String,
            required: false
        }
    },
    created() {
        console.log(this.docId);
        this.fetchData();
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
            docType: 'A02',
            docData: {
                namaKontrak: '',
                noProyek: '',
                tglKontrak: '',
                noKontrak: '',
                pemberiKerja: '',
                jenisDokumen: ''
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
                        docType: body.data.file.documentType,
                        ...this.docData
                    };
                    this.selectedFile = null;
                    this.uploadDocument(data);
                } else {
                    console.log('File gagal diunggah.');
                }
            })
            .catch(error => {
                console.log('Permintaan tidak bisa diproses. Error: ' + error);
            })
        },
        async uploadDocument(data) {
            this.$axios(api.uploadDocData(data, data.docType))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    console.log('Dokumen berhasil diunggah');
                } else {
                    const body = response.data;
                    console.log('Dokumen gagal diunggah.');
                }
            })
            .catch(error => {
                console.log('Permintaan tidak bisa diproses. Error: ' + error);
            })
        },
        async fetchData() {
            if (this.docId) {
                this.$axios(api.getDocData(this.docId))
                .then(response => {
                    if (response.status == 200) {
                        const body = response.data;
                        console.log('Dokumen berhasil diambil');
                        this.fetchFile(body.data.docName);
                    } else {
                        const body = response.data;
                        console.log('Dokumen gagal diambil. Error: ' + body.message);
                    }
                })
                .catch(err => {
                    console.log('Permintaan tidak bisa diproses. Error: ' + err)
                })
            }
        },
        async fetchFile(filename) {
            this.$axios(api.getDocFile(filename))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    console.log('File berhasil diambil');
                    this.localPreview = URL.createObjectURL(body);
                } else {
                    const body = response.data;
                    console.log('File gagal diambil. Error: ' + body.message);
                    this.localPreview = null;
                }
            })
            .catch(err => {
                console.log('Permintaan tidak bisa diproses. Error: ' + err)
            })
        }
    },
    beforeUnmount() {
        if (this.localPreview) {
            URL.revokeObjectURL(this.localPreview);
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