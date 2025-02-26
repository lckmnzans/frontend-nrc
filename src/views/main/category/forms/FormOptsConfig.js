import api from '@/api/document.api';
import { useToastStore } from '@/store/toastStore';
import { mapActions } from 'pinia';

export default {
    inject: ['$auth'],
    props: {
        mode: {
            type: String,
            default: 'create',
            validator: (value) => ['create', 'edit'].includes(value),
        },
        docId: {
            type: String,
            required: false,
        },
        filename: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            localPreview: null,
            selectedFile: null,
            loading: false,
            error: false,
            role: localStorage.getItem('role'),
            docName: '',
            attributeStatus: {},
            additionalFiles: [],
            isNotesEditable: false
        };
    },
    methods: {
        ...mapActions(useToastStore, {
            setToast: 'setToast',
        }),
        deleteDocument(docId, filename) {
            this.loading = true;
            this.error = false;

            const role = this.$auth.getRole();
            const softDelete = role == 'admin' ? true : false;

            this.axios(api.deleteDocument(docId, filename, softDelete))
            .then(response => {
                if (response.status == 200) {
                    this.error = false;

                    if (role == 'admin') {
                        this.setToast('Hapus dokumen', 'Dokumen ditandai untuk dihapus', 3000);
                    } else {
                        this.setToast('Hapus dokumen', 'Dokumen sukses dihapus', 3000);
                    }
                    this.$router.back();
                } else {
                    this.error = true;

                    this.setToast('Hapus dokumen', 'Dokumen gagal dihapus', 3000);
                }
            })
            .catch(err => {
                this.error = true;
                console.error('Error:', err);
            })
            .finally(() => {
                this.loading = false;
            })
        },
        async handleUpdate() {
            const notes = {};
            Object.keys(this.attributeStatus).forEach(key => {
                if (key == 'additionalNotes' || key == 'docTypeValidity') {
                    notes[key] = this.attributeStatus[key];
                } else {
                    this.attributeStatus[key] = true;
                    notes[key] = true;
                }
            })
            
            const docData = {...this.docData};
            docData['notes'] = JSON.stringify(notes);
            this.axios(api.updateDocData(docData, this.docType, this.docId))
                .then((response) => {
                    if (response.status === 200) {
                        this.setToast('Edit dokumen', 'Dokumen berhasil diperbarui', 3000);
                        this.$router.back();
                    } else {
                        this.setToast('Edit dokumen', 'Dokumen gagal diperbarui', 3000);
                    }
                })
                .catch((err) => {
                    console.error('Error:', err);
                });
        },
        async fetchData() {
            if (this.docId) {
                this.axios(api.getDocData(this.docId))
                    .then((response) => {
                        if (response.status === 200) {
                            const body = response.data;
                            Object.keys(this.docData).forEach((key) => {
                                if (body.data.hasOwnProperty(key)) {
                                    this.docData[key] = body.data[key];
                                }
                            });
                            if (body.data.notes) {
                                this.attributeStatus = JSON.parse(body.data.notes);
                            } else {
                                this.attributeStatus = JSON.parse(JSON.stringify(this.docData));
                                Object.keys(this.attributeStatus).forEach(key => {
                                    this.attributeStatus[key] = true;
                                });
                            }
                            this.docName = body.data.docName;
                            this.fetchFile(body.data.docName);
                        } else {
                            console.error('Dokumen gagal diambil.');
                        }
                    })
                    .catch((err) => {
                        console.error('Error:', err);
                    });
            }
        },
        async fetchFile(filename) {
            this.error = false;
            this.axios(api.getPdf(filename))
                .then((response) => {
                    if (response.status === 200) {
                        this.localPreview = URL.createObjectURL(response.data);
                        this.error = false;
                    } else {
                        console.error('File gagal diambil.');
                        this.localPreview = null;
                        this.error = true;
                    }
                })
                .catch((err) => {
                    console.error('Error:', err);
                    this.error = true;
                });
        },
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
                            const file = body.data.file;

                            const formData = {
                                docName: file.filename,
                                fileRef: [file._id],
                                docType: file.documentType,
                                notes: '',
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
            this.axios(api.uploadDocData(data, data.docType, true))
            .then((response) => {
                const body = response.data;

                if (response.status === 200) {
                    this.setToast('Unggah dokumen', 'Dokumen berhasil diunggah.', 3000);
                    this.selectedFile = null;
                    console.log(body);
                } else {
                    this.setToast('Unggah dokumen', 'Dokumen gagal diunggah', 3000);
                    console.error('Dokumen gagal diunggah.');
                }
            })
            .catch((err) => {
                console.error('Error:', err);
            });
        },
        setAttributesNull() {    
            if (this.mode == 'create') {
                this.attributeStatus = JSON.parse(JSON.stringify(this.docData));
                Object.keys(this.attributeStatus).forEach(key => {
                    this.attributeStatus[key] = true;
                });
            }
        },
        enableNotesEditArea() {
            this.isNotesEditable = false;
        }
    },
    beforeUnmount() {
        if (this.localPreview) {
            URL.revokeObjectURL(this.localPreview);
        }
    },
    beforeRouteLeave(to,from) {
        if (this.localPreview) {
            URL.revokeObjectURL(this.localPreview);
        }
    },
};
