export default {
    upload: (document, docType) => {
        const formData = new FormData();
        formData.append('document', document);
        formData.append('docType', docType);
        return {
            method: 'POST',
            url: "http://localhost:8000/api/v1/document", 
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
            url: `http://localhost:8000/api/v1/document/${docType}`,
            data: docData,
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    },
    getListOfDocuments: (page, limit, docType) => {
        let url = `http://localhost:8000/api/v1/document/list-document`
        if (page || limit || docType) url = url.append('?');
        if (page) url = url.append('page='+page);
        if (limit) url = url.append('limit='+limit);
        if (docType) url = url.append('docType='+docType);
        return {
            method: 'GET',
            url: url,
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    }
}