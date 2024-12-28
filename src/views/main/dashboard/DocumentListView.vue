<template>
    <div class="list-container">
        <h4>Dokumen Terbaru</h4>
        <p>Daftar dokumen yang baru masuk sistem</p>   
        <div class="list-documents">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Jenis Dokumen</th>
                        <th scope="col">Nama Dokumen/File</th>
                        <th scope="col">Waktu Unggah</th>
                        <th scope="col">Status</th>
                        <th scope="col" colspan="2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(doc, index) in docs" :key="index" @click="goToPage(doc.docType, doc._id)">
                        <td>{{ index + 1 }}</td>
                        <td>{{ documentType(doc.docType) }}</td>
                        <td>{{ doc.docName }}</td>
                        <td>{{ parseToLocalTime(doc.createdDate) }}</td>
                        <td>
                            <span class="badge" :class="`bg-${verifyStatus(doc.verificationStatus, ['primary','secondary'])}`">{{ verifyStatus(doc.verificationStatus, ['Sudah', 'Belum']) }} diverifikasi</span>
                        </td>
                        <td>
                            <div class="button">
                                <button title="unduh"><span class="material-icons">download_for_offline</span></button>
                            </div>
                        </td>
                        <td>
                            <div class="button">
                                <button title="verifikasi"><span class="material-icons" :class="verifyStatus(doc.verificationStatus, ['icon-verified','icon-unverified'])">task_alt</span></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>Menampilkan {{ currentPage }} dari {{ totalPages }} halaman</p>
    </div>
</template>
<script>
import api from '@/api/document.api';
import { mapState, mapWritableState, mapActions } from 'pinia';
import { usePageStore, useDocumentsListStore, useDocumentsTypeStore } from '@/store';
import { useToastStore } from '@/store/toastStore';
export default {
    created() {
        this.setPageTitle('Dashboard Utama');
        this.fetchDocs();
    },
    computed: {
        ...mapWritableState(useDocumentsListStore, {
            totalPages: 'totalPages',
            totalDocuments: 'totalDocuments',
            docs: 'docs'
        }),
        ...mapState(useDocumentsTypeStore, {
            documentType: 'documentTypeName'
        })
    },
    data() {
        return {
            currentPage: 0
        };
    },
    methods: {
        async fetchDocs() {
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
                    this.setToast('Gagal mendapatkan dokumen.', 3000);
                }
            })
            .catch((err) => {
                console.log(err);
            })
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
        })
    }
}
</script>
<style lang="scss" scoped>
.list-container {
    display: flex;
    flex-direction: column;
}

.list-documents {
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-between;
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