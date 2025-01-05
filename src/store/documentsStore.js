import { defineStore } from "pinia";

export const useDocumentsListStore = defineStore('documents-list', {
  state: () => {
    return {
      docFilter: {
        docType: '',
        docStatus: '',
        keyword: ''
      },
      currentPage: 1,
      limit: 10,
      totalPages: 0,
      totalDocuments: 0,
      docs: []
    }
  }
});