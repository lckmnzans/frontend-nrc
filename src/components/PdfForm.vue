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
                    @change="handleFileInput"/>
            </div>
            <div v-if="selectedFile" class="mb-3">
                <p><strong>File yang dipilih:</strong> {{ selectedFile.name }}</p>
            </div>

            <div class="mb-3 submit-control">
                <button type="submit" class="btn btn-primary btn-sm" :disabled="isFormEmpty">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
                    <span class="text" v-else>Unggah</span>
                </button>
            </div>
        </form>
    </div>
</template>
<script>
export default {
    emits: ["update:localPreview","update:fileName","submit"],
    props: {
        disabledState: {
            type: Boolean,
            default: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isFormEmpty() {
            return !this.selectedFile || this.disabledState;
        }
    },
    data() {
        return {
            selectedFile: null,
            fileName: null
        }
    },
    methods: {
        handleFileInput(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.selectedFile = file;
                this.fileName = file.name;

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.$emit("update:localPreview", e.target.result);
                }
                reader.readAsDataURL(file);
            } else {
                alert('Hanya dokumen PDF yang dapat diunggah');
                event.target.value = "";
                this.selectedFile = null;
            }
            this.$emit("update:fileName", this.fileName);
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

        button {
            min-width: 100px;
        }
    }

}
</style>
