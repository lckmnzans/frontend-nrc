<template>
    <div class="upload-form">
        <h4>Unggah Dokumen PDF</h4>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="file" class="form-label">Pilih Dokumen (PDF)</label>
                <input
                    type="file"
                    class="form-control"
                    id="file"
                    accept="application/pdf"
                    @change="handleFileUpload"/>
            </div>
            <div v-if="selectedFile" class="mb-3">
                <p><strong>File yang dipilih:</strong> {{ selectedFile.name }}</p>
            </div>
            <div class="mb-3">
                <label for="" class="form-label">Jenis Dokumen</label>
                <select class="form-select" v-model="docType">
                    <option value="">Pilih jenis dokumen</option>
                    <option value="cv">CV</option>
                    <option value="keuangan">Keuangan</option>
                    <option value="kontrak">Kontrak</option>
                    <option value="legalitas">Legalitas</option>
                    <option value="pemegang_saham">Pemegang Saham</option>
                    <option value="pengurus">Pengurus</option>
                    <option value="surat_masuk">Surat Masuk</option>
                    <option value="tenaga_ahli">Tenaga Ahli</option>
                </select>
            </div>
            <div class="mb-3 submit-control">
                <button type="submit" class="btn btn-primary btn-sm" :disabled="formFilled">Unggah</button>
            </div>
        </form>
    </div>
</template>
<script>
export default {
    emits: ["update:selectedFile","update:localPreview","submit"],
    computed: {
        formFilled() {
            return (this.docType.trim() === '') || !this.selectedFile;
        }
    },
    data() {
        return {
            selectedFile: null,
            docType: ''
        }
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.selectedFile = file;

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.$emit("update:localPreview", e.target.result);
                }
                reader.readAsDataURL(file);
            } else {
                alert('Hanya dokumen PDF yang dapat diunggah');
                event.target.value = "";
                this.$emit("update:selectedFile", null);
            }

            this.$emit("update:selectedFile", this.selectedFile);
        },
        async handleSubmit() {
            this.$emit("submit", this.selectedFile, this.docType);
        }
    }
}
</script>
<style scoped>
.upload-form {
    display:flex;
    flex-direction: column;

    .submit-control {
        display: flex;
        justify-content: space-between;
    }

}
</style>
