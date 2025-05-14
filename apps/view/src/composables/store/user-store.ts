import { defineStore } from 'pinia'
import { type IGlobalPreference } from '~/modules/words'
import { useLeafEventBus } from '../event'
import { UserConfigSaveEvent } from '../event/config'

const eventBus = useLeafEventBus()

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      privateConfig: {
        preference: {} as IGlobalPreference
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
    saveConfig(executor = "UserStore") {
      eventBus.fireEvent(new UserConfigSaveEvent(executor))
    }
  },
})
