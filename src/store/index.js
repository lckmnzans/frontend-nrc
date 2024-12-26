import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
  state: () => {
    return {
      /** @type {{page: number, content: string}[]} */
      pages: [],
      /** @type {[{subPageId: string, subPageTitle: string}[]]} */
      subPages: []
    }
  },
  getters: {
    getSubPagesByPage: (state) => {
      return (id) => state.subPages[id];
    } 
  }
});

export const useDocumentsListStore = defineStore('documents-list', {
  state: () => {
    return {
      totalPages: 0,
      totalDocuments: 0,
      docs: []
    }
  }
});

export const useDocumentsTypeStore = defineStore('documents-type', {
  state: () => {
    return {
      /** @type {{docTypeId: string, docTypeName: string}[]} */
      documents: [
      ]
    }
  },
  getters: {
    documentTypeName: (state) => (docTypeId) => {
      const document = state.documents.find(document => document.docTypeId == docTypeId);
      return document.docTypeName;
    }
  }
})