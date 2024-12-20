<template>
    <div class="form-container">
        <div class="input-form">
            <h4>Formulir CV</h4>
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama</label>
                    <input type="text" class="form-control" v-model="docData.nama"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Dokumen</label>
                    <input type="text" class="form-control" v-model="docData.noDokumen"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jabatan</label>
                    <input type="text" class="form-control" v-model="docData.jabatan"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tempat Tanggal Lahir</label>
                    <input type="text" class="form-control" v-model="docData.ttl"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pendidikan Terakhir</label>
                    <input type="text" class="form-control" v-model="docData.pendidikanTerakhir"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Instansi Pendidikan</label>
                    <input type="text" class="form-control" v-model="docData.instansiPendidikan"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tahun Lulus</label>
                    <input type="text" class="form-control" v-model="docData.tahunLulus"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pengalaman Kerja</label>
                    <input type="text" class="form-control" v-model="docData.pengalamanKerja"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Proyek Terakhir</label>
                    <input type="text" class="form-control" v-model="docData.proyekTerakhir"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Alamat KTP</label>
                    <input type="text" class="form-control" v-model="docData.alamatKtp"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Email</label>
                    <input type="text" class="form-control" v-model="docData.email"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.HP</label>
                    <input type="text" class="form-control" v-model="docData.noHp"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.NPWP</label>
                    <input type="text" class="form-control" v-model="docData.noNPWP"/> 
                </div>
            </form>
            <PdfForm
            :disabled-state="isFormEmpty"
            @update:local-preview="localPreview = $event"
            @submit="handleSubmit"
            />
        </div>
        <PreviewPdf :pdf="localPreview" />
    </div>
</template>
<script>
import PdfForm from '@/components/PdfForm.vue';
import PreviewPdf from '@/components/PreviewPdf.vue';
import api from '@/api/document.api';
export default {
    components: {
        PdfForm,
        PreviewPdf
    },
    inject: ['$axios'],
    computed: {
        isFormEmpty() {
            return Object.values(this.docData).includes('');
        }
    },
    data() {
        return {
            localPreview: null,
            selectedFile: null,
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
            }
        };
    },
    methods: {
        handleSubmit(file) {
            if (!file) {
                alert('Tidak ada file yang dipilih.');
                return;
            }

            this.$axios(api.upload(file, this.docType))
            .then(response => {
                if (response.status = 200) {
                    const body = response.data;
                    alert('File berhasil diunggah');
                    this.selectedFile = null;
                } else {
                    alert('Permintaan gagal diproses server dan file gagal diunggah');
                }
            })
            .catch(error => {
                alert('Terjadi kesalahan dalam mengirim permintaan.')
            })
        }
    }
}
</script>
<style scoped>
.form-container {
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-between;
    padding: 1.5rem;
}
</style>