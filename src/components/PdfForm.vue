<template>
    <div class="pdf-form">
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

            <div class="mb-3 submit-control">
                <button type="submit" class="btn btn-primary btn-sm">Unggah</button>
            </div>
        </form>
    </div>
</template>
<script>
export default {
    emits: ["update:selectedFile","update:localPreview","submit"],
    props: {
        disabledState: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            selectedFile: null
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
            this.$emit("submit", this.selectedFile);
        }
    }
}
</script>
<style scoped>
.pdf-form {
    display:flex;
    flex-direction: column;

    .submit-control {
        display: flex;
        justify-content: space-between;
    }

}
</style>
