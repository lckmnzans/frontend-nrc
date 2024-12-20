<template>
    <div class="form-container">
        <div class="input-form">
            <h4>Formulir Tenaga Ahli</h4>
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama</label>
                    <input type="text" class="form-control" v-model="docData.nama"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Sertifikat</label>
                    <input type="text" class="form-control" v-model="docData.noSertifikat"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tanggal Terbit</label>
                    <input type="text" class="form-control" v-model="docData.tglTerbit"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Masa Berlaku</label>
                    <input type="text" class="form-control" v-model="docData.masaBerlaku"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jenis Sertifikat Keahlian</label>
                    <input type="text" class="form-control" v-model="docData.jenisSertifikatKeahlian"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jabatan</label>
                    <input type="text" class="form-control" v-model="docData.jabatan"/> 
                </div>
                <div class="alert alert-info" role="alert">
                    Perhatian! Form yang dikosongkan akan diisi otomatis oleh sistem
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
            docType: 'A03',
            docData: {
                nama: '',
                noSertifikat: '',
                tglTerbit: '',
                masaBerlaku: '',
                jenisSertifikatKeahlian: '',
                jabatan: ''
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