import { defineStore } from "pinia";

export const useDocumentsListStore = defineStore('documents-list', {
  state: () => {
    return {
      allDocs: true,
      docFilter: {
        docType: '',
        docStatus: '',
        startDate: '',
        endDate: '',
        keyword: ''
      },
      currentPage: 1,
      limit: 10,
      totalPages: 0,
      totalDocuments: 0,
      docs: [],
      /** @type {[{reqId: string, docName: string, status: string}[]]} */
      translateTask: []
    }
  },
  getters: {
    getTranslationTask: (state) => (filename) => {
      const translationTask = state.translateTask.find(task => task.docName == filename);
      return translationTask;
    },
    getTranslationTaskId: (state) => (filename) => {
      const translationTaskId = state.translateTask.findIndex(task => task.docName == filename);
      return translationTaskId;
    }
  },
  persist: {
    storage: sessionStorage
  }
});