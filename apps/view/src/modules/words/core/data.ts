import { modeManager, ModeType } from '../mode'

export const useTargetData = createGlobalState(() => {
  const targetDict = computed(() => dictionaries.find(item => item.id === globalData.value.dict) || dictionaries[0])
  const targetMode = computed(() => {
    const manager = [...(modeManager?.keys?.() || [])]
    const result = manager?.find(item => item === globalData.value.mode)

    if (!result)
      return manager?.[0] || ModeType.COMPREHENSIVE

    return result
  })
  const targetSignMode = computed(() => {
    const manager = modeManager.get(targetMode.value!)!
    const managerIns = manager(targetDict.value.storage)

    return managerIns
  })

  return {
    targetDict,
    targetMode,
    targetSignMode,
  }
})

