<template>
    <div class="container" style="margin-left: 0;">
        <div class="row gap-3">
            <div class="col border rounded-1 d-flex justify-content-center align-items-center" id="container-previewpdf">
                <div class="spinner-border" role="status" v-if="loading">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="d-flex flex-column" v-else-if="!loading && error">
                    <p>Kesalahan dalam memuat data</p>
                    <button class="btn btn-outline-secondary" @click.prevent="">Muat ulang</button>
                </div>
                <div v-else-if="!loading && !error">
                    <div v-if="localPreview == null">
                        <span class="text">Pdf tidak dimuat</span>
                    </div>
                    <PreviewPdf v-else :pdf="localPreview" />
                </div>
            </div>
            <div class="col border rounded-1" id="container-attributesdoc">
                <div class="col">
                    <div class="form-check form-switch">
                        <input class="form-check-input" id="mode" type="checkbox" autocomplete="off" v-model="viewMode">
                        <label class="form-check-label" for="mode">Mode Review</label>
                    </div>
                    <div class="alert" :class="`alert-${docData['verificationStatus'] == 'verified' ? 'info' : 'warning' }`">
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
                                        <input class="form-check-input" type="checkbox" :value="true" :id="`check-${attribute.name}`" v-model="docData.notes[attribute.name]">
                                        <label class="form-check-label" :for="`check-${attribute.name}`">
                                            Sudah Sesuai
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col">
                    <label class="form-label" for="notes">Catatan tambahan</label>
                    <textarea class="form-control" id="notes" rows="3"></textarea>

                    <button class="btn btn-primary" type="button" @click.prevent="updateDocument">
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
            loading: false,
            error: false,
            localPreview: null,
            viewMode: true,
            docSchema: [],
            docData: {
                verificationStatus: 'unverified',
            },
            attributesStatus: {
                docTypeValidity: true,
            }
        }
    },
    watch: {
        // viewMode() {
        //     this.setToast('notif', `viewMode: ${this.viewMode}`, 2000);
        // },
    },
    created() {
        this.setPageTitle('Verifikasi dokumen');
        // set skema form
        var documentsSchema = JSON.parse(localStorage.getItem('documents-schema'));
        this.docSchema = documentsSchema.find(doc => doc.formId == this.docType).formSchema;

        // set initialize value untuk setiap field
        this.docSchema.forEach(attribute => {
            this.docData[attribute.name] = attribute.value;
        })
        this.docData['notes'] = '';

        // ambil data document untuk mengisikan field
        this.fetchDocument();
    },
    methods: {
        ...mapActions(useToastStore, ['setToast']),
        ...mapActions(usePageStore, ['setPageTitle']),
        async fetchDocument() {
            this.axios(api.getDocData(this.docId))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    Object.keys(this.docData).forEach((key) => {
                        if (body.data.hasOwnProperty(key)) {
                            this.docData[key] = body.data[key];
                        }
                    })
                    
                    try {
                        this.docData.notes = JSON.parse(body.data.notes);
                    } catch(err) {
                        console.log(err);
                    }

                    this.fetchPdf(body.data['docName']);
                } else {
                    this.setToast('Error', 'Ada kesalahan dalam mengambil data dokumen.', 3000);
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        async fetchPdf(filename) {
            this.loading = true;
            this.error = false;

            this.axios(api.getPdf(filename))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    this.localPreview = URL.createObjectURL(body);
                } else {
                    this.setToast('Error', 'Ada kesalahan dalam mengambil data dokumen.', 3000);
                    this.localPreview = null;
                    this.error = true;
                }
            })
            .catch(err => {
                console.log(err);
                this.error = true;
            })
            .finally(() => {
                this.loading = false;
            })
        },
        async updateDocument() {
            this.loading = true;
            const docData = this.docData;
            docData.notes = JSON.stringify(this.docData.notes);
            this.axios(api.updateDocData(docData, this.docType, this.docId))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    this.setToast('Sukses', 'Dokumen diverifikasi', 3000);
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.loading = false;
            })
        }
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
    height:600px;

    .preview-pdf {
        height: 600px;
    }
}

#container-attributesdoc {
    min-width: 490px;
}
</style>