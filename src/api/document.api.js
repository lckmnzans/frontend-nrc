const ApiHost = process.env.VUE_APP_BACKEND_URL;
export default {
    ApiHost,
    upload: (document, docType) => {
        const formData = new FormData();
        formData.append('document', document);
        formData.append('docType', docType);
        return {
            method: 'POST',
            url: `${ApiHost}/api/v1/document`, 
            data: formData,
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token"),
                "content-type": "multipart/form-data"
            }
        }
    },
    uploadDocData: (docData, docType) => {
        return {
            method: 'POST',
            url: `${ApiHost}/api/v1/document/${docType}`,
            data: docData,
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    },
    getListOfDocuments: (page, limit, docType, verificationStatus, startDate, endDate, keyword) => {
        const url = new URL(`${ApiHost}/api/v1/document/list-document`);
        const params = new URLSearchParams();

        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (Array.isArray(docType)) {
            docType.forEach(type => 
                params.append('docType', type)
            );
        } else if (docType) {
            params.append('docType', docType);
        }
        if (verificationStatus) params.append('verificationStatus', verificationStatus);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (keyword) params.append('keyword', keyword);

        if (Array.from(params).length > 0) {
            url.search = params.toString();
        }

        return {
            method: 'GET',
            url: url.toString(),
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    },
    getDocData: (docId) => {
        return {
            method: 'GET',
            url: `${ApiHost}/api/v1/document/docs/${docId}`,
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    },
    getPdf: (filename) => {
        return {
            method: 'GET',
            url: `${ApiHost}/api/v1/document/pdf/${filename}?requestedFile=pdf`,
            responseType: 'blob'
        }
    },
    getPdfThumbnail: (filename) => {
        return `${ApiHost}/api/v1/document/pdf/${filename}`
    },
    updateDocData: (docData, docType, docId) => {
        return {
            method: 'PATCH',
            url: `${ApiHost}/api/v1/document/docs/${docType}/${docId}`,
            data: docData,
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    }
}