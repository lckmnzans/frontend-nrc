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
    }
}