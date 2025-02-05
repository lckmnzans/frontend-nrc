<template>
    <div class="pdf-form">
        <div class="mb-3">
            <label for="file" class="form-label">Dokumen Utama</label>
            <input class="form-control" id="file"
                type="file"
                accept="application/pdf"
                @change="handleFileInput" />
        </div>
        <div v-if="selectedFile" class="mb-3">
            <p><strong>File yang dipilih:</strong> {{ selectedFile.name }}</p>
        </div>
        
        <div class="mb-3">
            <label for="additional-file" class="form-label">Dokumen Tambahan (jika ada)</label>
            <input class="form-control" id="additional-file" 
                type="file" 
                accept="application/pdf" 
                @change="handleAdditionalFilesInput" 
                multiple />
        </div>
        <div v-if="additionalFiles" class="mb-3">
            <p><strong>File tambahan yang dipilih: </strong>{{ additionalFiles.filesName }}</p>
        </div>
    </div>
</template>
<script>
export default {
    emits: ["update:localPreview","add:file","add:files"],
    data() {
        return {
            selectedFile: null,
            additionalFiles: null,
            files: null
        }
    },
    methods: {
        handleFileInput(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.selectedFile = file;

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.$emit("update:localPreview", e.target.result);
                }
                reader.readAsDataURL(file);
                this.$emit("add:file", this.selectedFile);
            } else {
                alert('Hanya dokumen PDF yang dapat diunggah');
                event.target.value = "";
                this.selectedFile = null;
            }
        },
        handleAdditionalFilesInput(event) {
            const files = event.target.files;
            if (files && files.length > 0) {
                const count = files.length;
                const filesName = [];
                for (var i = 0; i < count; i++) {
                    filesName.push(files[i].name);
                }
                this.additionalFiles = {
                    filesName: filesName.join(', '),
                    count: count
                }
                this.$emit('add:files', files);
            } else {
                this.additionalFiles = null;
                console.log('No files selected');
            }
        },
        showFiles(event) {
            const files = event.target.files;
            if (files) {
                console.log('Files ada isinya: ', files.length, ' file');
                console.log('dengan isi dari files');
                for (var i = 0; i < files.length; i++) {
                    console.log(`${i}`+' Nama file: ' + files[i].name);
                }
            } else {
                console.log('Files kosong');
            }
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
