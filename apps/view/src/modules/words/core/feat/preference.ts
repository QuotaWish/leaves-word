import type { EnglishDictionary } from '~/composables/api/clients/globals'
import { useRequest } from 'alova/client'
import { LeafDictStorage } from '../../index'
import { ModeType } from '../enums'

export interface IGlobalPreference {
  dict: {
    id: string,
    loading: boolean,
    data?: EnglishDictionary,
    storage?: LeafDictStorage
  }
  mode: ModeType
  amount: number
}

export const obj: IGlobalPreference = {
  dict: {
    id: '',
    data: undefined,
    loading: false,
  },
  mode: ModeType.COMPREHENSIVE,
  amount: 10,
}

export const currentStorage = shallowRef()

export const globalPreference = useLocalStorage<IGlobalPreference>('global-preference', JSON.parse(JSON.stringify(obj)))

const { send: getDict, loading } = useRequest(() => Apis.englishDictionaryController.getEnglishDictionaryVOByIdUsingGET({
  params: {
    id: globalPreference.value.dict.id,
  },
}), {
  immediate: false,
})

watch(loading, (newVal) => {
  globalPreference.value.dict.loading = newVal
}, {
  immediate: true,
})

watch(() => globalPreference.value.dict.id, (newVal) => {
  if (!newVal) {
    return
  }

  setTimeout(async () => {
    const res = await getDict()

    if (!res?.data) {
      globalPreference.value.dict.data = undefined
      globalPreference.value.dict.id = ''

      return
    }

    globalPreference.value.dict.data = res.data
    globalPreference.value.dict.storage = currentStorage.value = new LeafDictStorage(res.data)
  })
}, {
  immediate: true,
})
