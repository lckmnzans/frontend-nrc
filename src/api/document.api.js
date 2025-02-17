const ApiHost = process.env.VUE_APP_BACKEND_URL || '';
const baseUrl = window.location.origin;
export default {
    ApiHost,
    uploadAll: (document, additionalDocuments, docType) => {
        const formData = new FormData();
        formData.append('docType', docType);
        formData.append('documents', document);
        if (additionalDocuments.length > 0) {
            for (let i = 0; i < additionalDocuments.length; i++) {
                formData.append('documents', additionalDocuments[i]);
            }
        }

        return {
            method: 'POST',
            url: `/api/v1/document/multi`,
            data: formData,
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token"),
                "content-type": "multipart/form-data"
            }
        }
    },
    uploadDocData: (docData, docType, ocr) => {
        const url = new URL(`/api/v1/document/${docType}`, baseUrl);
        const params = new URLSearchParams();
        if (ocr) params.append('ocr', ocr);
        url.search = params.toString();

        return {
            method: 'POST',
            url: url,
            data: docData,
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    },
    getListOfDocuments: (page, limit, docType, verificationStatus, startDate, endDate, keyword, withFileDetail) => {
        const url = new URL('/api/v1/document/list-document', baseUrl);
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
        if (withFileDetail) params.append('withFileDetail', withFileDetail);

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
            url: `/api/v1/document/docs/${docId}`,
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    },
    getPdf: (filename) => {
        return {
            method: 'GET',
            url: `/api/v1/document/pdf/${filename}?requestedFile=pdf`,
            responseType: 'blob'
        }
    },
    updateDocData: (docData, docType, docId) => {
        return {
            method: 'PATCH',
            url: `/api/v1/document/docs/${docType}/${docId}`,
            data: docData,
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    },
    deleteDocument: (docId, docName, softDelete) => {
        const url = new URL(`/api/v1/document/docfile`, baseUrl);
        const params = new URLSearchParams();
        if (softDelete) {
            params.append('softDelete', softDelete);
        }

        if (Array.from(params).length > 0) {
            url.search = params.toString();
        }

        const docData = {
            docId: docId,
            filename: docName
        }
        return {
            method: 'DELETE',
            url: url.toString(),
            data: docData,
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    },
    translateDocument: (data) => {
        const url = new URL(`/api/v1/document/pdf/translate`, baseUrl);
        const requestData = {
            userId: data.userId,
            filename: data.filename
        }
        return {
            method: 'POST',
            url: url.toString(),
            data: requestData,
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    },
    getTranslatedDocument: (req_id) => {
        const url = new URL(`/api/v1/document/pdf/translate/${req_id}`, baseUrl);
        return {
            method: 'GET',
            url: url.toString(),
            responseType: 'blob'
        }
    }
}