import Loading from '@/components/Loading.vue';
import PdfForm from '@/components/PdfForm.vue';
import PreviewPdf from '@/components/PreviewPdf.vue';
import api from '@/api/document.api';
import { useToastStore } from '@/store/toastStore';
import { mapActions } from 'pinia';
export default {
    components: {
        Loading,
        PdfForm,
        PreviewPdf
    },
    props: {
        mode: {
            type: String,
            default: 'create',
            validator: (value) => ['create', 'edit'].includes(value)
        },
        docId: {
            type: String,
            required: false
        },
        filename: {
            type: String,
            required: false
        }
    },
    created() {
        this.fetchData();
    },
    computed: {
        isRequiredFormEmpty() {
            return this.docData.noDokumen == '' || this.docData.email == '' || this.docData.noHp == '' || this.docData.noNPWP == '';
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
            },
            loading: false,
            error: false,
        };
    },
    methods: {
        async handleUpdate() {
            this.axios(api.updateDocData(this.docData, this.docType, this.docId))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    this.setToast('', 'Dokumen berhasil diperbarui', 3000);
                    this.$router.back();
                } else {
                    this.setToast('', 'Dokumen gagal diperbarui', 3000);
                }
            })
            .catch(err => {
                console.log('Permintaan tidak bisa diproses. Error: ' + err);
            })
        },
        async handleSubmit(file) {
            if (this.isRequiredFormEmpty) {
                this.setToast('', 'Form ada yang perlu diisi', 3000);
            } else {
                this.uploadFile(file);
            }
        },
        async uploadFile(file) {
            if (!file) {
                alert('Tidak ada file yang dipilih.');
                return;
            }

            this.axios(api.upload(file, this.docType))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    const data = {
                        docName: body.data.file.filename,
                        docType: body.data.file.documentType,
                        ...this.docData
                    };
                    this.selectedFile = null;
                    this.uploadDocument(data);
                } else {
                    console.log('File gagal diunggah.');
                }
            })
            .catch(error => {
                console.log('Permintaan tidak bisa diproses. Error: ' + error);
            })
        },
        async uploadDocument(data) {
            this.axios(api.uploadDocData(data, data.docType))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    console.log('Dokumen berhasil diunggah');
                    this.setToast('', 'Dokumen berhasil diunggah.', 3000);
                } else {
                    const body = response.data;
                    console.log('Dokumen gagal diunggah.');
                }
            })
            .catch(error => {
                console.log('Permintaan tidak bisa diproses. Error: ' + error);
            })
        },
        async fetchData() {
            if (this.docId) {
                this.axios(api.getDocData(this.docId))
                .then(response => {
                    if (response.status == 200) {
                        const body = response.data;
                        console.log('Dokumen berhasil diambil');
                        this.fetchFile(body.data.docName);
                    } else {
                        const body = response.data;
                        console.log('Dokumen gagal diambil. Error: ' + body.message);
                    }
                })
                .catch(err => {
                    console.log('Permintaan tidak bisa diproses. Error: ' + err)
                })
            }
        },
        async fetchFile(filename) {
            this.error = false;
            this.axios(api.getDocFile(filename))
            .then(response => {
                if (response.status == 200) {
                    const body = response.data;
                    console.log('File berhasil diambil');
                    this.localPreview = URL.createObjectURL(body);
                    this.error = false;
                } else {
                    const body = response.data;
                    console.log('File gagal diambil. Error: ' + body.message);
                    this.localPreview = null;
                    this.error = true;
                }
            })
            .catch(err => {
                console.log('Permintaan tidak bisa diproses. Error: ' + err);
                this.error = true;
            })
        },
        ...mapActions(useToastStore, {
            setToast: 'setToast'
        })
    },
    beforeUnmount() {
        if (this.localPreview) {
            URL.revokeObjectURL(this.localPreview);
        }
    }
}