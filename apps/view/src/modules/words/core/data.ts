import { modeManager } from '../mode'
import { ModeType } from './enums'
import { currentStorage, globalPreference } from './feat/preference'

export const useTargetData = createGlobalState(() => {
  const targetMode = computed(() => {
    const manager = [...(modeManager?.keys?.() || [])]
    const result = manager?.find(item => item === globalPreference.value.mode)

    if (!result)
      return manager?.[0] || ModeType.COMPREHENSIVE

    return result
  })

  const targetSignMode = computed(() => {
    const manager = modeManager.get(targetMode.value)

    if (!manager || !currentStorage.value)
      return null

    const managerIns = manager(currentStorage.value)

    return managerIns
  })

  return {
    targetMode,
    targetSignMode,
  }
})
