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
                        <input type="text" class="form-control" v-model="docData.nama" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.nama">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.Dokumen *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noDokumen" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.noDokumen">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Jabatan</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.jabatan" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.jabatan">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tempat Tanggal Lahir</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.ttl" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.ttl">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pendidikan Terakhir</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.pendidikanTerakhir" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.pendidikanTerakhir">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Instansi Pendidikan</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.instansiPendidikan" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.instansiPendidikan">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Tahun Lulus</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.tahunLulus" :disabled="role == 'user'"/> 
                        <span class="material-icons" v-if="!attributeStatus.tahunLulus">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Pengalaman Kerja</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.pengalamanKerja" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.pengalamanKerja">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Proyek Terakhir</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.proyekTerakhir" :disabled="role == 'user'"/> 
                        <span class="material-icons" v-if="!attributeStatus.proyekTerakhir">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Alamat KTP</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.alamatKtp" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.alamatKtp">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Email *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.email" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.email">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.HP *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noHp" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.noHp">error</span>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">No.NPWP *</label>
                    <div class="input-control">
                        <input type="text" class="form-control" v-model="docData.noNPWP" :disabled="role == 'user'"/>
                        <span class="material-icons" v-if="!attributeStatus.noNPWP">error</span>
                    </div>
                </div>
                <div class="alert alert-info" role="alert" v-if="ocrable">
                    Perhatian! Form yang dikosongkan akan diisi otomatis oleh sistem
                </div>
            </form>

            <!-- <PdfForm v-if="mode == 'create'"
            :disabled-state="isRequiredFormEmpty"
            :loading="loading"
            @update:local-preview="localPreview = $event"
            @submit="handleSubmit"
            /> -->

            <div v-if="mode == 'create'">
                <PdfForm 
                @update:local-preview="localPreview = $event"
                @add:file="selectedFile = $event"
                @add:files="additionalFiles = $event" />
                
                <button class="btn btn-primary btn-sm" @click.prevent="handleUpload" :disabled="isRequiredFormEmpty || !selectedFile || loading">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
                    <span class="text">Unggah</span>
                </button>
            </div>
            <div v-else-if="mode == 'edit'">
                <button class="btn btn-primary btn-sm" @click.prevent="handleUpdate">Simpan</button>
            </div>
        </div>
    </div>
</template>
<script>
import Loading from '@/components/Loading.vue';
import PdfForm from '@/components/PdfsForm.vue';
import PreviewPdf from '@/components/PreviewPdf.vue';
import FormOptions from '@/views/main/category/forms/FormOptsConfig';
import api from '@/api/document.api';

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
            additionalFiles: []
        }
    },
    methods: {
        ...FormOptions.methods,
        async handleUpload() {
            if (this.isRequiredFormEmpty) {
                this.setToast('', 'Ada form yang perlu diisi', 3000);
            } else {
                if (this.selectedFile) {
                    this.loading = true;

                    this.axios(api.uploadAll(this.selectedFile, this.additionalFiles, this.docType))
                    .then(async response => {
                        const body = response.data;

                        if (response.status == 200) {
                            this.setToast('', 'Dokumen berhasil diunggah.', 3000);
                            const file = body.data.file;
                            console.log(file);

                            const formData = {
                                docName: file.filename,
                                fileRef: [file._id],
                                docType: file.documentType,
                                ...this.docData,
                            }
                            await this.uploadFormData(formData); 
                        } else {
                            console.log('Dokumen gagal diunggah');
                        }
                    })
                    .catch(err => {
                        console.log('Error', err);
                    })
                    .finally(() => {
                        this.loading = false;
                    })
                } else {
                    alert('Tidak ada file yang dipilih');
                }
            }
        },
        async uploadFormData(data) {
            this.axios(api.uploadDocData(data, data.docType))
            .then((response) => {
                const body = response.data;

                if (response.status === 200) {
                    this.setToast('', 'Dokumen berhasil diunggah.', 3000);
                    console.log(body);
                } else {
                    console.error('Dokumen gagal diunggah.');
                }
            })
            .catch((err) => {
                console.error('Error:', err);
            });
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