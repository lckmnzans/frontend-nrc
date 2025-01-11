<template>
    <div class="list-container" >
        <h4>Dokumen Terbaru</h4>
        <p>Daftar dokumen yang masuk sistem</p>
        <form class="filter-documents" @submit.prevent="fetchDocs">
            <div id="doctype-filter" class="filter-selection">
                <label for="document-type-select"><span class="text">Jenis Dokumen</span></label>
                <select v-model="docFilter.docType" class="form-select form-select-sm" id="document-type-select">
                    <option value="" selected>Semuanya</option>
                    <option value="A01">Legalitas</option>
                    <option value="A02">Kontrak</option>
                    <option value="A03">Tenaga Ahli</option>
                    <option value="A04">CV</option>
                    <option value="A05">Keuangan</option>
                    <option value="A06">Proyek</option>
                    <option value="A07">Pengurus</option>
                    <option value="A08">Pemegang Saham</option>
                    <option value="A09">Peralatan</option>
                    <option value="A10">Lain-lain</option>
                    <option value="B01">Surat Masuk</option>
                    <option value="B02">Surat Keluar</option>
                    <option value="C01">Sertifikat</option>
                    <option value="C02">SPJB</option>
                </select>
            </div>
            <div id="status-filter" class="filter-selection">
                <label for="document-status-select"><span class="text">Status verifikasi</span></label>
                <select v-model="docFilter.docStatus" class="form-select form-select-sm" id="document-status-select">
                    <option value="" selected>Semuanya</option>
                    <option value="verified">Sudah diverifikasi</option>
                    <option value="unverified">Belum diverifikasi</option>
                </select>
            </div>
            <div id="name-filter" class="filter-search">
                <label for="document-name-search"><span class="text">Cari berdasar nama</span></label>
                <input v-model="docFilter.keyword"type="text" class="form-control form-control-sm" id="document-name-search" placeholder="Nama dokumen" />
            </div>
            <button class="btn btn-primary btn-sm" type="submit" style="margin-top: auto;">Terapkan</button>
        </form>
        <div class="list-documents" >
            <LoadingOverlay :visible="loading" v-if="loading"/>
            <div class="error-container" v-else-if="!loading && error">
                <p>Data Gagal Diambil</p>
                <button class="btn btn-outline-secondary" @click.prevent="fetchDocs">Reload</button>
            </div>
            <div class="table-container" v-else-if="!loading && !error">
                <span class="text">Mendapatkan {{ totalDocuments }} dokumen</span>
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
                            <td>{{ limit * (currentPage-1) + index + 1 }}</td>
                            <td>{{ documentType(doc.docType) }}</td>
                            <td>{{ doc.docName }}</td>
                            <td>{{ parseToLocalTime(doc.createdDate) }}</td>
                            <td>
                                <span class="badge" :class="`bg-${verifyStatus(doc.verificationStatus, ['primary','secondary'])}`">{{ verifyStatus(doc.verificationStatus, ['Sudah', 'Belum']) }} diverifikasi</span>
                                <span class="badge bg-info text-dark" v-if="doc.hasPassedScreening">OCR</span>
                            </td>
                            <td>
                                <div class="button">
                                    <button title="unduh" @click.prevent="downloadDoc(doc.docName)"><span class="material-icons">download_for_offline</span></button>
                                </div>
                            </td>
                            <td>
                                <div class="button">
                                    <router-link :to="`/edit/${doc.docType}/${doc._id}`"><span class="material-icons">open_in_new_down</span></router-link>
                                </div>
                            </td>
                            <td>
                                <div class="button" v-if="role == 'superadmin'">
                                    <router-link :to="`/review/${doc.docType}/${doc._id}`"><span class="material-icons">task_alt</span></router-link>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="footer-container" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                    <span class="text">Menampilkan {{ currentPage }} dari {{ totalPages }} halaman</span>
                    <div class="btn-toolbar" role="toolbar">
                        <div class="btn-group me-2" role="group">
                            <input v-for="n in totalPages" type="radio" class="btn-check" name="page" :id="`btnradio-page-${n}`" autocomplete="off" :checked="currentPage === n" @change="changePage(n)">
                            <label v-for="n in totalPages" :class="['btn btn-sm', currentPage === n ? 'btn-primary' : 'btn-secondary']" :for="`btnradio-page-${n}`">{{ n }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import LoadingOverlay from '@/components/Loading.vue';
import api from '@/api/document.api';
import { mapState, mapWritableState, mapActions } from 'pinia';
import { usePageStore, useDocumentsTypeStore } from '@/store';
import { useToastStore } from '@/store/toastStore';
import { useDocumentsListStore } from '@/store/documentsStore';
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
            docFilter: 'docFilter',
            currentPage: 'currentPage',
            limit: 'limit',
            totalPages: 'totalPages',
            totalDocuments: 'totalDocuments',
            docs: 'docs'
        }),
        ...mapState(useDocumentsTypeStore, {
            documentType: 'documentTypeName'
        }),
    },
    data() {
        return {
            loading: false,
            error: false,
            role: 'admin'
        };
    },
    methods: {
        async fetchDocs() {
            this.loading = true;
            this.error = false;

            this.axios(api.getListOfDocuments(this.currentPage, this.limit, this.docFilter.docType, this.docFilter.docStatus))
            .then((response) => {
                if (response.status == 200) {
                    const body = response.data;
                    this.totalPages = body.totalPages;
                    this.totalDocuments = body.totalDocuments;
                    this.currentPage = body.currentPage;
                    this.docs = body.documents;
                    console.log('Dokumen berhasil didapatkan.');
                } else {
                    this.error = true;
                    console.log('Gagal melakukan permintaan.');
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
                    link.download = filename;
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
        goToVerif(docType, docId) {
            this.$router.push({ path: `/review/${docType}/${docId}` });
        },
        ...mapActions(usePageStore, ['setPageTitle']),
        ...mapActions(useToastStore, {
            setToast: 'setToast'
        }),
        changePage(page) {
            this.currentPage = page;
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

    .text {
        margin-left: 2px;
    }

    .filter-documents {
        display: flex;
        flex-direction: row;
        gap: 6px;
        
        .text {
            margin: 0 0 0 4px;
            font-size: small;
        }

        .filter-selection {
            display: flex;
            flex-direction: column;
        }
    }

    .list-documents {
        display: flex;
        flex-direction: row;
        align-items: top;
        justify-content: space-between;
        margin-top: 1rem;
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
            background-color: var(--green);
        }

        .icon-unverified {
            background-color: var(--grey);
        }
    }
}
</style>