<template>
    <div class="form-container">
        <div class="previewpdf-container">
            <Loading :visible="loading" v-if="loading" />
            <div class="error-container" v-else-if="!loading && !localPreview">
                <span class="text" v-if="error">Gagal menampilkan PDF</span>
                <span class="text" v-else>PDF belum dipilih</span>
            </div>
            <PreviewPdf :pdf="localPreview" v-else-if="!loading && localPreview"/>
        </div>
        <div class="input-form">
            <h4>Formulir Pemegang Saham</h4>
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama *</label>
                    <input type="text" class="form-control" v-model="docData.nama"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jumlah Saham *</label>
                    <input type="text" class="form-control" v-model="docData.jmlSaham"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nilai Saham *</label>
                    <input type="text" class="form-control" v-model="docData.nilaiSaham"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Presentase *</label>
                    <input type="text" class="form-control" v-model="docData.presentase"/>
                </div>
                <div class="alert alert-info" role="alert">
                    Perhatian! Form yang dikosongkan akan diisi otomatis oleh sistem
                </div>
            </form>
            <PdfForm v-if="mode == 'create'"
            :disabled-state="isRequiredFormEmpty"
            @update:local-preview="localPreview = $event"
            @submit="handleSubmit"
            />
            <div v-else-if="mode == 'edit'">
                <button class="btn btn-primary btn-sm" @click.prevent="handleUpdate">Simpan</button>
            </div>
        </div>
    </div>
</template>
<script>
import Loading from '@/components/Loading.vue';
import PdfForm from '@/components/PdfForm.vue';
import PreviewPdf from '@/components/PreviewPdf.vue';
import api from '@/api/document.api';
import { useToastStore } from '@/store/toastStore';
import { mapActions } from 'pinia';
export default {
    components: {
        Loading,
        PdfForm,
        PreviewPdf
    },
    props: {
        mode: {
            type: String,
            default: 'create',
            validator: (value) => ['create', 'edit'].includes(value)
        },
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
        this.fetchData();
    },
    computed: {
        isRequiredFormEmpty() {
            return Object.values(this.docData).includes('');
        }
    },
    data() {
        return {
            localPreview: null,
            selectedFile: null,
            docType: 'A08',
            docData: {
                nama: '',
                jmlSaham:'',
                nilaiSaham:'',
                presentase:''
            },
            loading: false,
            error: false,
        };
    },
    methods: {
        async handleUpdate() {
            this.axios(api.updateDocData(this.docData, this.docType, this.docId))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    this.setToast('', 'Dokumen berhasil diperbarui', 3000);
                    this.$router.back();
                } else {
                    this.setToast('', 'Dokumen gagal diperbarui', 3000);
                }
            })
            .catch(err => {
                console.log('Permintaan tidak bisa diproses. Error: ' + err);
            })
        },
        async handleSubmit(file) {
            if (this.isRequiredFormEmpty) {
                this.setToast('', 'Form ada yang perlu diisi', 3000);
            } else {
                this.uploadFile(file);
            }
        },
        async uploadFile(file) {
            if (!file) {
                alert('Tidak ada file yang dipilih.');
                return;
            }

            this.axios(api.upload(file, this.docType))
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
            this.axios(api.uploadDocData(data, data.docType))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    console.log('Dokumen berhasil diunggah');
                    this.setToast('', 'Dokumen berhasil diunggah.', 3000);
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
                this.axios(api.getDocData(this.docId))
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
            this.error = false;
            this.axios(api.getDocFile(filename))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    console.log('File berhasil diambil');
                    this.localPreview = URL.createObjectURL(body);
                    this.error = false;
                } else {
                    const body = response.data;
                    console.log('File gagal diambil. Error: ' + body.message);
                    this.localPreview = null;
                    this.error = true;
                }
            })
            .catch(err => {
                console.log('Permintaan tidak bisa diproses. Error: ' + err);
                this.error = true;
            })
        },
        ...mapActions(useToastStore, {
            setToast: 'setToast'
        })
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
    justify-content: flex-start;
    padding: 1.5rem;
    gap: 1rem;

    .previewpdf-container {
        position: sticky;
        width: 768px;
        height: 600px;
        padding: 6px;
        display:flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 5px;

        .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }

        .preview-pdf {
            height: 600px;
        }
    }
}
</style>