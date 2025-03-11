import { defineStore } from 'pinia'

export const useBaseRouteStore = defineStore('base', {
  state: () => {
    return {
       excludeNames: [] as string[],
    }
  },
  actions: {
    updateExcludeRoutes(val: { type: 'add' | 'remove', value: string }) {
      if (val.type === 'add') {
        if (!this.excludeNames.find((v) => v === val.value)) {
          this.excludeNames.push(val.value)
        }
      } else {
        const resIndex = this.excludeNames.findIndex((v) => v === val.value)
        if (resIndex !== -1) {
          this.excludeNames.splice(resIndex, 1)
        }
      }
    }
  }
})
