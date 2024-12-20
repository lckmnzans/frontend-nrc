<template>
    <div class="form-container">
        <div class="input-form">
            <h4>Formulir Kontrak</h4>
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Nama Kontrak</label>
                    <input type="text" class="form-control" v-model="docData.namaKontrak"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Proyek</label>
                    <input type="text" class="form-control" v-model="docData.noProyek"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tanggal Kontrak</label>
                    <input type="text" class="form-control" v-model="docData.tglKontrak"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Kontrak</label>
                    <input type="text" class="form-control" v-model="docData.noProyek"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pemberi Kerja</label>
                    <input type="text" class="form-control" v-model="docData.pemberiKerja"/> 
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jenis Dokumen</label>
                    <input type="text" class="form-control" v-model="docData.jenisDokumen"/> 
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
            docType: 'A02',
            docData: {
                namaKontrak: '',
                noProyek: '',
                tglKontrak: '',
                noKontrak: '',
                pemberiKerja: '',
                jenisDokumen: ''
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