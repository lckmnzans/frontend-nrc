<template>
    <div>
        <h4>Dokumen Terbaru</h4>
        <p>Daftar dokumen yang baru masuk sistem</p>   
        <div class="list-documents">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Document Type</th>
                        <th scope="col">Document Name</th>
                        <th scope="col">Input Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(doc, index) in docs" :key="index" @click="goToPage(doc.docType, doc._id)">
                        <td>{{ doc.docType }}</td>
                        <td>{{ doc.docName }}</td>
                        <td>{{ parseToLocalTime(doc.createdDate) }}</td>
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
        },
        parseToLocalTime(strDate) {
            const date = new Date(strDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            // Gabungkan menjadi string
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },
        goToPage(docType, docId) {
            this.$router.push({ path: `/edit/${docType}/${docId}` });
        }
    }
}
</script>
<style scoped>

.list-documents {
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-between;
}
</style>