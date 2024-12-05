<template>
    <h3>Halaman Utama</h3>
    <div class="upload-form">
    <h4>Upload Dokumen PDF</h4>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="file" class="form-label">Pilih Dokumen (PDF)</label>
                <input
                    type="file"
                    class="form-control"
                    id="file"
                    accept="application/pdf"
                    @change="handleFileUpload"
                />
            </div>
            <div v-if="selectedFile" class="mb-3">
                <p><strong>File yang dipilih:</strong> {{ selectedFile.name }}</p>
            </div>
            <div>
                <button type="submit" class="btn btn-primary btn-sm" :disabled="!selectedFile">Upload</button>
            </div>
        </form>
    </div>
</template>
<script>
export default {
    inject: ['$axios'],
    data() {
        return {
            selectedFile: null,
        }
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.selectedFile = file;
            } else {
                alert('Hanya dokumen PDF yang dapat diunggah');
                event.target.value = "";
            }
        },
        handleSubmit() {
            if (!this.selectedFile) {
                alert('Tidak ada file yang dipilih.');
                return;
            }

            const formData = new FormData();
            formData.append('document', this.selectedFile);
            this.$axios({
                method: 'POST',
                url: "http://localhost:8000/api/v1/document", 
                data: formData,
                headers: {
                    "authorization": "Bearer " + localStorage.getItem("token"),
                    "content-type": "multipart/form-data"
                },
            })
            .then(response => {
                if (response.status == 200) {
                    alert('File berhasil diunggah');
                    this.selectedFile = null;
                } else {
                    alert('Permintaan gagal diproses dan file gagal diunggah');
                }
            })
            .catch(error => {
                alert('Terjadi kesalahan saat mengupload file.')
            })
        }
    }
}
</script>
<style scoped>
.upload-form {
    max-width: 500px;
    margin: 2rem auto;
}

.mb-3 {
    margin-bottom: 1rem;
}

button {
    cursor: pointer;
}
</style>
