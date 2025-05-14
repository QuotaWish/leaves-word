import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      privateConfig: {

      },
      publicConfig: {

      },
    }
  },
  actions: {
    updateConfig(obj: { privateConfig: any, publicConfig: any }) {
      this.privateConfig = obj.privateConfig
      this.publicConfig = obj.publicConfig
    },
  },
})
