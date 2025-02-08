<template>
    <div class="form-container" >
        <div id="previewpdf-container">
            <Loading :visible="loading" v-if="loading" />
            <div class="error-container" v-else-if="!loading && !localPreview">
                <span class="text" v-if="error">Gagal menampilkan PDF</span>
                <span class="text" v-else>PDF belum dipilih</span>
            </div>
            <PreviewPdf :pdf="localPreview" v-else-if="!loading && localPreview"/>
        </div>
        <div class="input-form">
            <h4>Formulir Legalitas</h4>
            <form class="d-flex flex-column">
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama Dokumen *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.namaDokumen" required :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.namaDokumen">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Instansi Penerbit</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.instansiPenerbit" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.instansiPenerbit">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Dokumen</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noDokumen" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.noDokumen">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tanggal Terbit</label>
                    <div class="input-control">
                        <input type="date" class="form-control" v-model="docData.tglTerbit" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.tglTerbit">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Masa Berlaku s/d</label>
                    <div class="input-control">
                        <input type="date" class="form-control" v-model="docData.masaBerlaku" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.masaBerlaku">error</span>
                    </div>
                </div>
                <div class="alert alert-info" role="alert" v-if="ocrable && mode == 'create'">
                    Perhatian! Form yang dikosongkan akan diisi otomatis oleh sistem
                </div>
            </form>

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
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
                <button class="btn btn-primary btn-sm" @click.prevent="handleUpdate" :disabled="isFormEmptied">Simpan</button>
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
        PreviewPdf,
    },
    created() {
        this.fetchData();
        this.setAttributesNull();
    },
    computed: {
        isRequiredFormEmpty() {
            return this.docData.namaDokumen == '';
        },
        isFormEmptied() {
            return Object.values(this.docData).includes('');
        }
    },
    data() {
        return {
            ...FormOptions.data(),
            docType: 'A01',
            docData: {
                namaDokumen: '',
                instansiPenerbit: '',
                noDokumen: '',
                tglTerbit: '',
                masaBerlaku: '',
            },
            ocrable: true,
        }
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

    #previewpdf-container {
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
    }

    .input-control {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        min-width: 400px;
        gap: 6px;
    }
}
</style>