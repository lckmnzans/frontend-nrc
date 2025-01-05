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
            <h4>Preview Form</h4>
            <div class="form-header">
                <div class="alert" :class="`alert-${docData.verificationStatus == 'verified' ? 'info' : 'warning' }`">
                    {{ docData.verificationStatus == 'verified' ? 'Sudah' : 'Belum' }} divalidasi
                </div>
            </div>
            <form class="form-body" @submit.prevent="saveChanges">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Atribut</th>
                            <th style="min-width: 320px;">Nilai</th>
                            <th>Kesesuaian data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in docSchema" :key="index">
                            <td>{{ item.label }}</td>
                            <td>{{ docData[item.name] }}</td>
                            <td>
                                <div class="btn-group btn-group-sm" role="group">
                                    <input type="radio" class="btn-check" :name="`btnradio-${item.name}`" :id="`btnradio-${item.name}-0`" autocomplete="off" v-model="attributesStatus[item.name]" :value="false" checked>
                                    <label class="btn btn-outline-primary" :for="`btnradio-${item.name}-0`">Belum Sesuai</label>

                                    <input type="radio" class="btn-check" :name="`btnradio-${item.name}`" :id="`btnradio-${item.name}-1`" autocomplete="off" v-model="attributesStatus[item.name]" :value="true">
                                    <label class="btn btn-outline-primary" :for="`btnradio-${item.name}-1`">Sudah Sesuai</label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="form-group">
                    <label class="form-label" for="notes">Catatan tambahan</label>
                    <textarea class="form-control" id="notes" rows="3"></textarea>
                </div>
                <div>
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
import { mapState } from 'pinia';
import { useDocumentsSchemaStore } from '@/store';
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
        const formSchema = this.formSchema(this.docType);
        this.docSchema = formSchema;
        const formData = formSchema.reduce((obj, item) => {
            obj[item.name] = item.value;
            return obj;
        }, {});
        formData['verificationStatus'] = 'verified';
        this.docData = structuredClone(formData);
        this.attributesStatus = structuredClone(formData);

        this.fetchData();
    },
    data() {
        return {
            localPreview: '',
            loading: false,
            error: false,
            docSchema: [],
            docData: {},
            attributesStatus: {}
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
            let notes = 'Catatan:';
            Object.keys(this.attributesStatus).forEach(attributeName => {
                if (this.attributesStatus[attributeName] != true) {
                    console.log(`Atribut ${attributeName} belum sesuai`);
                }
            })
            console.log(this.attributesStatus);
        }
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
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .loading-overlay {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--dark);
        color: var(--light);
        mix-blend-mode: difference;
    }
    
    .error-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}

.form-container {
    width: 100%;
    min-width: 300px;

    .form-header {
        display: flex;
        flex-direction: column;
    }

    .form-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
}
</style>