<template>
    <div class="modal fade" id="modalConfirmDelete" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConfirmDeleteLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalConfirmDeleteLabel">Konfirmasi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Anda yakin ingin menghapus dokumen ini?</p>
                </div>
                <div class="modal-footer">
                    <div class="d-flex flex-row gap-3">
                        <button id="btn-next" class="btn btn-danger" data-bs-dismiss="modal" @click.prevent="deleteDocument(docId, docName)">Lanjutkan</button>
                        <button id="btn-cancel" class="btn btn-secondary" data-bs-dismiss="modal">Batalkan</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="form-container">
        <div id="previewpdf-container">
            <Loading :visible="loading" v-if="loading" />
            <div class="error-container" v-else-if="!loading && !localPreview">
                <span class="text" v-if="error">Gagal menampilkan PDF</span>
                <span class="text" v-else>PDF belum dipilih</span>
            </div>
            <PreviewPdf :pdf="localPreview" v-else-if="!loading && localPreview"/>
        </div>
        <div >
            <div class="d-flex justify-content-between align-items-center">
                <h4>Formulir SPJB</h4>
                <button v-if="role != 'user' && mode == 'edit'" class="border border-0" style="background-color: #fff; color: var(--secondary);" title="Hapus dokumen"
                data-bs-toggle="modal" data-bs-target="#modalConfirmDelete"
                >
                    <span class="material-icons fs-4">delete</span>
                </button>
            </div>
            <form class="d-flex flex-column">
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama PIC</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.namaPic" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.namaPic">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama PT Penjual</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.namaPtPenjual" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.namaPtPenjual">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No. PPJB</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noPPJB" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.noPPJB">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tanggal PPJB</label>
                    <div class="input-control">
                        <input type="date" class="form-control" v-model="docData.tglPPJB" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.tglPPJB">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Lokasi</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.lokasi" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.lokasi">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Luas</label>
                    <div class="input-control">
                        <input type="number" class="form-control" v-model="docData.luas" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.luas">error</span>
                    </div>
                </div>
                <!-- <div class="alert alert-info" role="alert" v-if="ocrable && mode == 'create'">
                    Perhatian! Form yang dikosongkan akan diisi otomatis oleh sistem
                </div> -->
                <div class="form-group mb-3" v-if="mode == 'edit'">
                    <div class="input-header d-flex justify-content-between align-items-center">                
                        <label for="additionalNotes" class="form-label">Catatan</label>
                        <button class="border border-0" @click.prevent="isNotesEditable = !isNotesEditable;" title="Ubah catatan"><span class="material-icons fs-6">edit</span></button>
                    </div>
                    <textarea class="form-control" id="additionalNotes" rows="3" :value="attributeStatus?.additionalNotes" :disabled="!isNotesEditable" @change="attributeStatus.additionalNotes = $event.target.value"></textarea>
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
                <button class="btn btn-primary btn-sm" @click.prevent="handleUpdate" :disabled="isFormEmptied || role == 'user'">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>Simpan
                </button>
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
            return Object.values(this.docData).includes('');
        },
        isFormEmptied() {
            return Object.values(this.docData).includes('');
        }
    },
    data() {
        return {
            ...FormOptions.data(),
            docType: 'C01',
            docData: {
                namaPic:'',
                namaPtPenjual:'',
                noPPJB:'',
                tglPPJB:'',
                lokasi:'',
                luas:''
            },
            ocrable: false,
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