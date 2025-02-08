<template>
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
                <h4>Formulir CV</h4>
                <button v-if="role == 'superadmin' && mode == 'edit'" class="border border-0" style="background-color: #fff; color: var(--secondary);" title="Hapus dokumen"
                data-bs-toggle="modal" data-bs-target="#modalConfirmDelete"
                >
                    <span class="material-icons fs-4">delete</span>
                </button>
            </div>
            <form class="d-flex flex-column">
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.nama" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.nama">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Dokumen *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noDokumen" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.noDokumen">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jabatan</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.jabatan" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.jabatan">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tempat Tanggal Lahir</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.ttl" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.ttl">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pendidikan Terakhir</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.pendidikanTerakhir" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.pendidikanTerakhir">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Instansi Pendidikan</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.instansiPendidikan" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.instansiPendidikan">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tahun Lulus</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.tahunLulus" :disabled="role == 'user'"/> 
                        <span class="material-icons" v-if="!attributeStatus?.tahunLulus">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pengalaman Kerja</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.pengalamanKerja" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.pengalamanKerja">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Proyek Terakhir</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.proyekTerakhir" :disabled="role == 'user'"/> 
                        <span class="material-icons" v-if="!attributeStatus?.proyekTerakhir">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Alamat KTP</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.alamatKtp" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.alamatKtp">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Email *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.email" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.email">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.HP *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noHp" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.noHp">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.NPWP *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noNPWP" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus?.noNPWP">error</span>
                    </div>
                </div>
                <div class="alert alert-info" role="alert" v-if="ocrable && mode == 'create'">
                    Perhatian! Form yang dikosongkan akan diisi otomatis oleh sistem
                </div>
                <div class="form-group mb-3" v-else>
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
                <button class="btn btn-primary btn-sm" @click.prevent="handleUpdate">
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
        PreviewPdf,
    },
    created() {
        this.fetchData();
        this.setAttributesNull();
    },
    computed: {
        isRequiredFormEmpty() {
            return this.docData.noDokumen == '' || this.docData.email == '' || this.docData.noHp == '' || this.docData.noNPWP == '';
        },
        isFormEmptied() {
            return Object.values(this.docData).includes('');
        }
    },
    data() {
        return {
            ...FormOptions.data(),
            docType: 'A04',
            docData: {
                nama: '',
                noDokumen: '',
                jabatan: '',
                ttl: '',
                pendidikanTerakhir: '',
                instansiPendidikan: '',
                tahunLulus:'',
                pengalamanKerja:'',
                proyekTerakhir:'',
                alamatKtp:'',
                email:'',
                noHp:'',
                noNPWP:''
            },
            ocrable: true,
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