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
            <h4>Formulir Surat Keluar</h4>
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pengirim</label>
                    <input type="text" class="form-control" v-model="docData.pengirm"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Surat</label>
                    <input type="text" class="form-control" v-model="docData.noSurat"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tanggal Terbit</label>
                    <input type="date" class="form-control" v-model="docData.tglTerbit"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Perihal</label>
                    <input type="text" class="form-control" v-model="docData.perihal" />
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Drafter</label>
                    <input type="text" class="form-control" v-model="docData.drafter" />
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tujuan Surat</label>
                    <input type="text" class="form-control" v-model="docData.tujuanSurat" />
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
    computed: {
        isRequiredFormEmpty() {
            return false;
        }
    },
    data() {
        return {
            localPreview: null,
            selectedFile: null,
            docType: 'B02',
            docData: {
                pengirm: '',
                noSurat: '',
                tglTerbit: '',
                perihal: '',
                drafter: '',
                tujuanSurat: ''
            },
            loading: false,
        };
    },
    methods: {
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
            this.axios(api.getDocFile(filename))
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
        width: 768px;
        height: 60vh;
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
    }
}
</style>