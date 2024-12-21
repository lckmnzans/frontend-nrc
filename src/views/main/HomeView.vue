<template>
    <div class="main-content">
        <h4>Dokumen Terbaru</h4>
        <p>Daftar dokumen yang baru masuk sistem</p>   
        <div class="list-documents">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Document Type</th>
                        <th scope="col">Document Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(doc, index) in docs" :key="index">
                        <td>{{ doc.docType }}</td>
                        <td>{{ doc.docName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import api from '@/api/document.api';
export default {
    inject: ['$axios'],
    created() {
        this.fetchDocs();
    },
    data() {
        return {
            totalPages: 1,
            currentPage: 0,
            docs: []
        };
    },
    methods: {
        async fetchDocs() {
            this.$axios(api.getListOfDocuments())
            .then((response) => {
                if (response.status == 200) {
                    const body = response.data;
                    this.totalPages = body.totalPages;
                    this.currentPage = body.currentPage;
                    this.docs = body.documents;
                    console.log('Dokumen berhasil didapatkan')
                } else {
                    console.log('Gagal melakukan permintaan');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
}
</script>
<style scoped>
.main-content {
    padding: 2rem;
}

.list-documents {
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-between;
}
</style>