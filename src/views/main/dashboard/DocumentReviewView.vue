<template>
    <div class="container" style="margin-left: 0;">
        <div class="row gap-3">
            <div class="col border rounded-1 d-flex justify-content-center align-items-center" id="container-previewpdf">
                <div class="spinner-border" role="status" v-if="loading">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="d-flex flex-column" v-else-if="!loading && response.error">
                    <p>Kesalahan dalam memuat data</p>
                    <button class="btn btn-outline-secondary" @click.prevent="">Muat ulang</button>
                </div>
                <div v-else-if="!loading && !response.error">
                    <div v-if="localPreview == null">
                        <span class="text">Pdf tidak dimuat</span>
                    </div>
                    <PreviewPdf v-else :pdf="localPreview" />
                </div>
            </div>
            <div class="col border rounded-1" id="container-attributesdoc">
                <div class="col mt-2">
                    <h4 class="mb-1">Review Atribut Dokumen</h4>
                    <div class="form-check form-switch mt-1">
                        <input class="form-check-input" id="mode" type="checkbox" autocomplete="off" v-model="viewMode">
                        <label class="form-check-label" for="mode">Mode Review</label>
                    </div>
                    <div class="alert mt-1" :class="`alert-${docData['verificationStatus'] == 'verified' ? 'info' : 'warning' }`">
                        {{ docData['verificationStatus'] == 'verified' ? 'Sudah' : 'Belum' }} diverifikasi
                    </div>
                </div>
                <div class="col">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Atribut</th>
                                <th>Isian</th>
                                <th>Kesesuaian data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(attribute, index) in docSchema" :key="index">
                                <td>{{ attribute.label }}</td>
                                <td>
                                    <input class="form-control form-control-sm" :type="attribute.type" v-model="docData[attribute.name]" :disabled="viewMode"/>
                                </td>
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" :id="`check-${attribute.name}`" :checked="docData.notes[attribute.name]" @change="docData.notes[attribute.name] = $event.target.checked">
                                        <label class="form-check-label" :for="`check-${attribute.name}`">Sudah Sesuai</label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col mb-3">
                    <label class="form-label" for="notes">Catatan tambahan</label>
                    <textarea class="form-control" id="notes" rows="3" :value="docData.notes.additionalNotes" @change="docData.notes.additionalNotes = $event.target.value"></textarea>

                    <button class="btn btn-primary mt-3" type="button" @click.prevent="updateDocument">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
                        <span class="text">Simpan perubahan</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import PreviewPdf from '@/components/PreviewPdf.vue';
import Forms from '@/components/Forms.vue';
import api from '@/api/document.api';
import { useToastStore } from '@/store/toastStore';
import { usePageStore } from '@/store';
import { mapActions } from 'pinia';

export default {
    components: {
        Loading,
        PreviewPdf,
        Forms
    },
    props: {
        docId: {
            type: String,
            required: true
        },
        docType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            viewMode: true,
            response: {
                error: false,
                code: 0,
            },
            loading: false,
            localPreview: null,
            docSchema: [],
            docData: {
                verificationStatus: 'unverified',
                notes: {
                    docTypeValidity: true,
                    additionalNotes: ''
                }
            },
        }
    },
    created() {
        // this.setPageTitle('Verifikasi dokumen');

        // set skema formulir
        var documentsSchema = JSON.parse(localStorage.getItem('documents-schema'));
        this.docSchema = documentsSchema.find(doc => doc.formId == this.docType).formSchema;

        // inisialisasi nilai awal untuk setiap field
        for (var attr of this.docSchema) {
            this.docData[`${attr.name}`] = attr.value;
            this.docData.notes[`${attr.name}`] = false;
        }
        
        // ambil data document untuk mengisikan field
        this.fetchDocument();
    },
    methods: {
        ...mapActions(useToastStore, ['setToast']),
        ...mapActions(usePageStore, ['setPageTitle']),
        async fetchDocument() {
            this.axios(api.getDocData(this.docId))
            .then(response => {
                this.response.code = response.status;

                if (response.status == 200) {
                    this.response.error = false;

                    const body = response.data;

                    Object.keys(this.docData).forEach((key) => {
                        if (body.data.hasOwnProperty(key)) {
                            if (key == 'notes') {
                                if (body.data['notes'] != null && body.data['notes'] != undefined && body.data['notes'].trim() != '') {
                                    try {
                                        console.log('Notes digantikan dengan data dari response.');
                                        const notes = JSON.parse(body.data.notes);
                                        this.docData.notes = notes;
                                    } catch(err) {
                                        console.log(err);
                                    }
                                }
                            } else {
                                this.docData[key] = body.data[key];
                            }
                            
                        }
                    })
                    
                    this.fetchPdf(body.data['docName']);
                } else {
                    this.response.error = true;
                    
                    this.setToast('', 'Data dokumen gagal diambil.', 3000);
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('', 'Ada kesalahan.', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
        async fetchPdf(filename) {
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;

            this.axios(api.getPdf(filename))
            .then(response => {
                this.response.code = response.status;

                if (response.status == 200) {
                    this.response.error = false;

                    const blob = response.data;
                    blob.arrayBuffer()
                    .then(result => {
                        this.localPreview = result;
                    })
                    .catch(err => {
                        this.setToast('', 'Gagal memuat dokumen PDF.', 3000);
                        console.error(err);
                    })
                } else {
                    this.response.error = true;
                    
                    this.localPreview = null;
                    this.setToast('', 'Dokumen PDF gagal diambil.', 3000);
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('', 'Ada kesalahan.', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
        async updateDocument() {
            this.docData.verificationStatus = 'verified';
            this.loading = true;
            this.response.error = false;
            this.response.code = 0;


            const docData = {...this.docData};
            docData.notes = JSON.stringify(docData.notes);
            this.axios(api.updateDocData(docData, this.docType, this.docId))
            .then(response => {
                this.response.code = response.status;

                if (response.status == 200) {
                    this.response.error = false;
                    
                    this.setToast('', 'Dokumen berhasil diverifikasi', 3000);
                } else {
                    this.response.error = true;

                    this.setToast('', 'Dokumen gagal diverifikasi', 3000);
                }
            })
            .catch(err => {
                if (err.response) {
                    this.response.code = err.response['status'];
                } else {
                    this.response.code = 500;
                }
                this.response.error = true;
                this.setToast('', 'Ada kesalahan.', 3000);
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
    },
    beforeUnmount() {
        if (this.localPreview) {
            URL.revokeObjectURL(this.localPreview);
        }
    },
}
</script>

<style lang="scss" scoped>
.row {
    gap: 2px;
}

#container-previewpdf {
    width:662px;
    height:600px;

    .preview-pdf {
        width: 650px;
        height: 600px;
    }
}
</style>