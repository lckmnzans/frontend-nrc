<template>
    <div class="form-container">
        <div class="input-form">
            <form>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pengirim</label>
                    <input type="text" class="form-control" v-model="docData.pengirm"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Surat</label>
                    <input type="text" class="form-control" v-model="docData.noSurat"/>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tanggal Terbit</label>
                    <input type="text" class="form-control" v-model="docData.tglTerbit"/>
                </div>
            </form>
            <PdfForm
            sub-category="B01"
            :disable-submit-button="formFilled"
            @update:selected-file="selectedFile = $event"
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
export default {
    components: {
        PdfForm,
        PreviewPdf
    },
    inject: ['$axios'],
    computed: {
        formFilled() {
            return (
                !this.docData.pengirm ||
                !this.docData.noSurat  ||
                !this.docData.tglTerbit
            );
        }
    },
    data() {
        return {
            selectedFile: null,
            docType: '',
            localPreview: null,
            docData: {
                pengirm: '',
                noSurat: '',
                tglTerbit: ''
            }
        };
    },
    methods: {
        handleSubmit(file, docType) {
            if (!file) {
                alert('Tidak ada file yang dipilih.');
                return;
            }

            console.log({
                docType: docType,
                docData: this.docData,
                file: file
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

    .preview-form {
        width: 40vw;
        height: 70vh;
    }
}
</style>