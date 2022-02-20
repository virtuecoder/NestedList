import { defineStore } from 'pinia'

export const useGlobal = defineStore({
  id: 'global',
  state: () => ({
    dateFormat: 'YYYY-MM-DD',
    dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  }),

  getters: {
  },

  actions: {
  }
})

