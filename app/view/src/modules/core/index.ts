/**
 * CoreModule 是APP的核心模块
 * 此Module会在APP运行时进行存在
 */
export const useGlobaCoreVisibleState = createGlobalState(
  () => {
    const dictionaryPageVisible = ref(!false)
    return { dictionaryPageVisible }
  },
)

export const useGlobaCoreState = createGlobalState(
  () => {

  },
)
