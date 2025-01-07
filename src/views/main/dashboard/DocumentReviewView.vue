<template>
    <div class="edit-container">
        <div class="previewpdf-container">
            <Loading :visible="loading" v-if="loading"/>
            <div class="error-container" v-else-if="!loading && error">
                <p>Kesalahan dalam memuat data</p>
                <button class="btn btn-outline-secondary" @click.prevent="fetchData">Muat ulang</button>
            </div>
            <PreviewPdf :pdf="localPreview" v-else-if="!loading && !error" />
        </div>
        <div class="form-container">
            <div class="form-header">
                <div class="form-check form-switch">
                    <input type="checkbox" class="form-check-input" id="review-mode" autocomplete="off" v-model="viewMode" checked>
                    <label class="form-check-label" for="review-mode">Mode Review</label>
                </div>
                <div class="alert" :class="`alert-${docData.verificationStatus == 'verified' ? 'info' : 'warning' }`">
                    {{ docData.verificationStatus == 'verified' ? 'Sudah' : 'Belum' }} diverifikasi
                </div>
            </div>
            <form class="form-body" @submit.prevent="saveChanges">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Atribut</th>
                            <th style="min-width: 660px;">Nilai</th>
                            <th>
                                <span class="text">Kesesuaian data</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(attribute, index) in docSchema" :key="index">
                            <td>{{ attribute.label }}</td>
                            <td>
                                <div v-if="viewMode">
                                    {{ docData[attribute.name] }}
                                </div>
                                <div v-else>
                                    <input :type="attribute.type" v-model="docData[attribute.name]" style="width: 100%; padding-left: 6px;">
                                </div>
                            </td>
                            <td>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" :value="true" :id="`check-${attribute.name}`" v-model="attributesStatus[attribute.name]">
                                    <label class="form-check-label" :for="`check-${attribute.name}`">
                                        Sudah Sesuai
                                    </label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <label class="form-label" for="notes">Catatan tambahan</label>
                <textarea class="form-control" id="notes" rows="3"></textarea>

                <div class="submit-control">
                    <button class="btn btn-primary btn-large" type="submit">Simpan perubahan</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import PreviewPdf from '@/components/PreviewPdf.vue';
import api from '@/api/document.api';
import { mapState, mapActions } from 'pinia';
import { usePageStore, useDocumentsSchemaStore } from '@/store';
import { useToastStore } from '@/store/toastStore';
export default {
    components: { Loading, PreviewPdf },
    props: {
        docType: {
            type: String,
            required: true
        },
        docId: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapState(useDocumentsSchemaStore, {
            formSchema:'formSchema'
        })
    },
    created() {
        this.setPageTitle('Review Dokumen');
        const formSchema = this.formSchema(this.docType);
        this.docSchema = formSchema;
        const formData = formSchema.reduce((obj, attribute) => {
            obj[attribute.name] = attribute.value;
            return obj;
        }, {});
        this.docData = structuredClone(formData);
        this.docData['verificationStatus'] = "verified";
        this.docData['hasPassedScreening']= false;
        this.docData['updatedDate'] = "2025-01-01T00:00:01.000Z";
        this.attributesStatus = structuredClone(formData);

        this.fetchData();
    },
    data() {
        return {
            viewMode: true,
            localPreview: '',
            loading: false,
            error: false,
            docSchema: [],
            docData: {},
            attributesStatus: {},
        }
    },
    methods: {
        async fetchData() {
            this.loading = true;
            this.error = false;

            if (this.docId) {
                this.axios(api.getDocData(this.docId))
                .then(response => {
                    if (response.status == 200) {
                        const body = response.data;
                        console.log('Dokumen berhasil diambil');
                        Object.keys(this.docData).forEach((key) => {
                            if (body.data.hasOwnProperty(key)) {
                                this.docData[key] = body.data[key];
                            }
                        })

                        this.fetchFile(body.data.docName);
                    } else {
                        const body = response.data;
                        console.log('Dokumen gagal diambil. Error: ' + body.message);
                        this.error = true;
                    }
                })
                .catch(err => {
                    console.log('Permintaan tidak bisa diproses. Error: ' + err);
                    this.error = true;
                })
                .finally(() => {
                    this.loading = false;
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
        changeData(key, value) {
            this.docData[key] = value;
        },
        saveChanges() {
            const notes = [];
            Object.keys(this.attributesStatus).forEach(attributeName => {
                if (this.attributesStatus[attributeName] === true) {
                    notes[attributeName] = true;
                } else {
                    notes[attributeName] = false;
                }
            })
            
            this.docData['verifiedStatus'] = 'verified';
            this.axios(api.updateDocData(this.docData, this.docType, this.docId))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    console.log('Dokumen berhasil diverifikasi');
                    this.setToast('', 'Dokumen diverifikasi', 3000);
                }
            })
            .catch(err => {
                console.log('Permintaan tidak bisa diproses. Error: ' + err);
            })
        },
        ...mapActions(usePageStore, ['setPageTitle']),
        ...mapActions(useToastStore, ['setToast'])
    },
    beforeUnmount() {
        if (this.localPreview) {
            URL.revokeObjectURL(this.localPreview);
        }
    }
}
</script>
<style lang="scss" scoped>
.edit-container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
}

.previewpdf-container {
    width: 768px;
    height: 600px;
    padding: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;

    .loading-overlay {
        border-radius: 5px;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--light);
        mix-blend-mode: multiply;
    }
    
    .error-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .preview-pdf {
        height: 600px;
    }
}

.form-container {

    .form-header {
        display: flex;
        flex-direction: column;
    }

    .form-body {
        display: flex;
        flex-direction: column;

        .submit-control {
            margin: 21px 0;
        }

        td {
            padding-top: 16px;
            padding-bottom: 16px;
        }
    }
}
</style>