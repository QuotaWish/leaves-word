import { modeManager } from '../mode'
import { ModeType } from './enums'
import { globalPreference } from './feat/preference'

export const useTargetData = createGlobalState(() => {
  const targetDict = computed(() => null) // dictionaries.find(item => item.id === globalData.value.dict) || dictionaries[0])
  const targetMode = computed(() => {
    const manager = [...(modeManager?.keys?.() || [])]
    const result = manager?.find(item => item === globalPreference.value.mode)

    if (!result)
      return manager?.[0] || ModeType.COMPREHENSIVE

    return result
  })
  const targetSignMode = computed(() => {
    const manager = modeManager.get(targetMode.value)

    if (!manager || !globalPreference.value.dict.storage)
      return null

    const managerIns = manager(globalPreference.value.dict.storage)

    return managerIns
  })

  return {
    targetDict,
    targetMode,
    targetSignMode,
  }
})
