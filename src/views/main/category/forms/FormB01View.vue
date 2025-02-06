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
            <h4>Formulir Surat Masuk</h4>
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pengirim</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.pengirim" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.pengirim">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No. Surat</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noSurat" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.noSurat">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tanggal Terbit</label>
                    <div class="input-control">
                        <input type="date" class="form-control" v-model="docData.tglTerbit" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.tglTerbit">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Perihal</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.perihal" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.perihal">error</span>
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
            return false;
        }
    },
    data() {
        return {
            ...FormOptions.data(),
            docType: 'B01',
            docData: {
                namaDokumen:'',
                instansiPenerbit:'',
                noDokumen:'',
                tglTerbit:''
            },
            ocrable: true,
        };
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

    .input-control {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        gap: 6px;
    }
}
</style>