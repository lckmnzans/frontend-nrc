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
            <h4>Formulir Kontrak</h4>
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama Kontrak *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.namaKontrak" required :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.namaKontrak">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Proyek</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noProyek" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.noProyek">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tanggal Kontrak</label>
                    <div class="input-control">
                        <input type="date" class="form-control" v-model="docData.tglKontrak" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.tglKontrak">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Kontrak</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noKontrak" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.noKontrak">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pemberi Kerja</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.pemberiKerja" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.pemberiKerja">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jenis Dokumen *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.jenisDokumen" required :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.jenisDokumen">error</span>
                    </div>
                </div>
                <div class="alert alert-info" role="alert" v-if="ocrable">
                    Perhatian! Form yang dikosongkan akan diisi otomatis oleh sistem
                </div>
            </form>

            <!-- <PdfForm v-if="mode == 'create'"
            :disabled-state="isRequiredFormEmpty"
            :loading="loading"
            @update:local-preview="localPreview = $event"
            @submit="handleSubmit"
            /> -->

            <div v-if="mode == 'create'">
                <PdfForm 
                @update:local-preview="localPreview = $event"
                @add:file="selectedFile = $event"
                @add:files="additionalFiles = $event" />
                
                <button class="btn btn-primary btn-sm" @click.prevent="handleUpload" :disabled="isRequiredFormEmpty || !selectedFile || loading">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
                    <span class="text">Unggah</span>
                </button>
            </div>
            <div v-else-if="mode == 'edit'">
                <button class="btn btn-primary btn-sm" @click.prevent="handleUpdate">Simpan</button>
            </div>
        </div>
    </div>
</template>
<script>
import Loading from '@/components/Loading.vue';
import PdfForm from '@/components/PdfsForm.vue';
import PreviewPdf from '@/components/PreviewPdf.vue';
import FormOptions from '@/views/main/category/forms/FormOptsConfig';

export default {
    ...FormOptions,
    components: {
        Loading,
        PdfForm,
        PreviewPdf
    },
    created() {
        this.fetchData();
        this.setAttributesNull();
    },
    computed: {
        isRequiredFormEmpty() {
            return this.docData.namaKontrak == '' || this.docData.jenisDokumen == '';
        }
    },
    data() {
        return {
            ...FormOptions.data(),
            docType: 'A02',
            docData: {
                namaKontrak: '',
                noProyek: '',
                tglKontrak: '',
                noKontrak: '',
                pemberiKerja: '',
                jenisDokumen: ''
            },
            ocrable: true,
        };
    }
}
</script>
<style style="scss" scoped>
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

    .input-control {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        gap: 6px;
    }
}
</style>