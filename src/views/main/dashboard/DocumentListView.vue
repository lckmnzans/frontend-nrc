<template>
    <div class="list-container" >
        <h4>Dokumen Terbaru</h4>
        <p>Daftar dokumen yang baru masuk sistem</p>
        <div class="list-documents" >
            <LoadingOverlay :visible="loading" />
            <div class="error-container" v-if="isDataRetrieved">
                <p>Data Gagal Diambil</p>
                <button class="btn btn-outline-secondary" @click.prevent="reload">Reload</button>
            </div>
            <div class="table-container" v-else-if="!isDataRetrieved && !loading">
                <table class="table table-hover" >
                    <thead>
                        <tr>
                            <th scope="col">No.</th>
                            <th scope="col">Jenis Dokumen</th>
                            <th scope="col">Nama Dokumen/File</th>
                            <th scope="col">Waktu Unggah</th>
                            <th scope="col">Status</th>
                            <th scope="col" colspan="3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(doc, index) in docs" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ documentType(doc.docType) }}</td>
                            <td>{{ doc.docName }}</td>
                            <td>{{ parseToLocalTime(doc.createdDate) }}</td>
                            <td>
                                <span class="badge" :class="`bg-${verifyStatus(doc.verificationStatus, ['primary','secondary'])}`">{{ verifyStatus(doc.verificationStatus, ['Sudah', 'Belum']) }} diverifikasi</span>
                            </td>
                            <td>
                                <div class="button">
                                    <button title="unduh" @click.prevent="downloadDoc(doc.docName)"><span class="material-icons">download_for_offline</span></button>
                                </div>
                            </td>
                            <td>
                                <div class="button">
                                    <button title="buka" @click="goToPage(doc.docType, doc._id)"><span class="material-icons">open_in_new_down</span></button>
                                </div>
                            </td>
                            <td>
                                <div class="button">
                                    <button title="verifikasi" :disabled="role == 'superadmin'?false:true" @click.prevent="console.log('test')"><span class="material-icons" :class="verifyStatus(doc.verificationStatus, ['icon-verified','icon-unverified'])">task_alt</span></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="!isDataRetrieved">Menampilkan {{ currentPage }} dari {{ totalPages }} halaman</p>
            </div>
        </div>
    </div>
</template>
<script>
import LoadingOverlay from '@/components/Loading.vue';
import api from '@/api/document.api';
import { mapState, mapWritableState, mapActions } from 'pinia';
import { usePageStore, useDocumentsListStore, useDocumentsTypeStore } from '@/store';
import { useToastStore } from '@/store/toastStore';
export default {
    components: {
        LoadingOverlay
    },
    inject: ['$auth'],
    created() {
        this.role = this.$auth.getRole();
        this.setPageTitle('Dashboard Utama');
        this.$watch(() => this.load, this.fetchDocs, { immediate: true});
    },
    computed: {
        ...mapWritableState(useDocumentsListStore, {
            totalPages: 'totalPages',
            totalDocuments: 'totalDocuments',
            docs: 'docs'
        }),
        ...mapState(useDocumentsTypeStore, {
            documentType: 'documentTypeName'
        }),
        isDataRetrieved() {
            return this.error;
        }
    },
    data() {
        return {
            currentPage: 0,
            loading: false,
            error: false,
            role: 'admin'
        };
    },
    methods: {
        async fetchDocs() {
            this.loading = true;
            this.error = false;

            this.axios(api.getListOfDocuments())
            .then((response) => {
                if (response.status == 200) {
                    const body = response.data;
                    this.totalPages = body.totalPages;
                    this.totalDocuments = body.totalDocuments;
                    this.currentPage = body.currentPage;
                    this.docs = body.documents;
                    console.log('Dokumen berhasil didapatkan.');
                    this.setToast('', 'Dokumen berhasil didapatkan.', 3000);
                } else {
                    console.log('Gagal melakukan permintaan.');
                    this.error = true;
                    this.setToast('Gagal mendapatkan dokumen.', 3000);
                }
            })
            .catch((err) => {
                console.log(err);
                this.error = true;
            })
            .finally(() => {
                this.loading = false;
            })
        },
        async downloadDoc(filename) {
            this.axios(api.getDocFile(filename))
            .then(response => {
                if (response.status == 200) {
                    const blob = response.data;
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename + '.pdf';
                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } else {
                    console.log('Gagal mengunduh dokumen. Status: ', response.status);
                }
            })
            .catch(err => {
                console.log('Terjadi kesalahan saat mengunduh dokumen. Error: ', err);
            });
        },
        parseToLocalTime(strDate) {
            const date = new Date(strDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },
        verifyStatus(verified, results) {
            if (verified == 'verified') {
                return results[0];
            } else {
                return results[1];
            }
        },
        goToPage(docType, docId) {
            this.$router.push({ path: `/edit/${docType}/${docId}` });
        },
        ...mapActions(usePageStore, ['setPageTitle']),
        ...mapActions(useToastStore, {
            setToast: 'setToast'
        }),
        reload() {
            this.fetchDocs();
        }
    }
}
</script>
<style lang="scss" scoped>
.list-container {
    position: relative;
    display: flex;
    flex-direction: column;

    .list-documents {
        display: flex;
        flex-direction: row;
        align-items: top;
        justify-content: space-between;
        min-height: 30vh;

        .loading-overlay {
            position: absolute;
            width: 100%;
            height: 30vh;
            // padding: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);
            // margin: 1px;
            border-radius: 8px;
            z-index: 9999;
        }

        .error-container {
            position: absolute;
            // padding: 25px;
            width: 100%;
            height: 30vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #fff;
        }

        .table-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 30vh;
        }
    }
}

.toast-container {
    bottom: 0;
    right: 0;
    margin-bottom: 1rem;
    margin-right: 1rem;
    position: fixed;
    z-index: 999;
}

.button {
    display: flex;
    justify-content: start;
    align-items: center;

    button {
        border: none;
        background: none;

        .icon-verified {
            color: var(--green);
        }

        .icon-unverified {
            color: var(--grey);
        }
    }
}
</style>