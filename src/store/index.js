import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
  state: () => {
    return {
      pageTitle: '',
      /** @type {{page: number, content: string}[]} */
      pages: [],
      /** @type {[{subPageId: string, subPageTitle: string}[]]} */
      subPages: [],
    }
  },
  getters: {
    getSubPagesByPage: (state) => {
      return (id) => state.subPages[id];
    }
  },
  actions: {
    setPageTitle(title) {
      this.pageTitle = title;
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

export const useDocumentsSchemaStore = defineStore('documents-schema', {
  state: () => {
    return {
      /** @type {{formId: string, formSchema: Array}[]}*/
      formsData: [],
    }
  },
  actions: {
    formSchema(docTypeId) {
      const forms = this.formsData.find(form => form.formId == docTypeId);
      return forms.formSchema;
    }
  }
})