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
            <h4>Formulir CV</h4>
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.nama"/>
                        <span class="material-icons" v-if="!attributeStatus.nama">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Dokumen *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noDokumen"/>
                        <span class="material-icons" v-if="!attributeStatus.noDokumen">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jabatan</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.jabatan"/>
                        <span class="material-icons" v-if="!attributeStatus.jabatan">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tempat Tanggal Lahir</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.ttl"/>
                        <span class="material-icons" v-if="!attributeStatus.ttl">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pendidikan Terakhir</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.pendidikanTerakhir"/>
                        <span class="material-icons" v-if="!attributeStatus.pendidikanTerakhir">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Instansi Pendidikan</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.instansiPendidikan"/>
                        <span class="material-icons" v-if="!attributeStatus.instansiPendidikan">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tahun Lulus</label>
                    <div class="input-control">
                        <input type="month" class="form-control" v-model="docData.tahunLulus"/> 
                        <span class="material-icons" v-if="!attributeStatus.tahunLulus">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pengalaman Kerja</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.pengalamanKerja"/>
                        <span class="material-icons" v-if="!attributeStatus.pengalamanKerja">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Proyek Terakhir</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.proyekTerakhir"/> 
                        <span class="material-icons" v-if="!attributeStatus.proyekTerakhir">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Alamat KTP</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.alamatKtp"/>
                        <span class="material-icons" v-if="!attributeStatus.alamatKtp">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Email *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.email"/>
                        <span class="material-icons" v-if="!attributeStatus.email">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.HP *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noHp"/>
                        <span class="material-icons" v-if="!attributeStatus.noHp">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.NPWP *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noNPWP"/>
                        <span class="material-icons" v-if="!attributeStatus.noNPWP">error</span>
                    </div>
                </div>
                <div class="alert alert-info" role="alert" v-if="ocrable">
                    Perhatian! Form yang dikosongkan akan diisi otomatis oleh sistem
                </div>
            </form>

            <PdfForm v-if="mode == 'create'"
            :disabled-state="isRequiredFormEmpty"
            :loading="loading"
            @update:local-preview="localPreview = $event"
            @submit="handleSubmit"
            />
            <div v-else-if="mode == 'edit'">
                <button class="btn btn-primary btn-sm" @click.prevent="handleUpdate">Simpan</button>
            </div>
        </div>
    </div>
</template>
<script>
import Loading from '@/components/Loading.vue';
import PdfForm from '@/components/PdfForm.vue';
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