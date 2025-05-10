import iPhone16Mock from '/mock/iPhone16.png'

/**
 * SpalshModule 是负责APP加载的入口
 * 此Module会在APP加载时进行初始化，并加载APP的配置文件，决定环境信息
 */
export enum ScreenMode {
  /** 移动端 */
  MOBILE,
  /** 非移动端 进行限制处理 */
  WRAPPED,
  /** Builder 容器内，需要略微适配 statusbar */
  BUILDER,
}

export const MOCK_DEVICES = {
  iPhone12: {
    value: 'iPhone12',
    label: 'iPhone 12',
    size: '390:844',
    mask: null,
  },
  iPhone16: {
    value: 'iPhone16',
    label: 'iPhone 16',
    size: '420:874', // 18px是左右侧按键的增加 一侧9px 数出来的
    mask: iPhone16Mock,
  },
} as const

export const useGlobalSplashState = createGlobalState(
  () => {
    const screenMode = ref(0)
    const mockStatusbar = ref(false)
    const footerVisible = ref(true)
    const mockDevice = ref(MOCK_DEVICES.iPhone16.value)

    return { screenMode, mockStatusbar, footerVisible, mockDevice }
  },
)

/**
 * 如果是 Builder 需要发送加载事件
 */
export function useBuilder() {
  const isBuilder = ref(false)

  /**
   * 检测 query 参数是否存在
   */
  function isBuilderQueyExist() {
    const url = new URL(window.location.href)
    const query = url.searchParams

    return query.get('query') === 'builder'
  }

  function check() {
    try {
      // @ts-ignore
      if (plus || isBuilderQueyExist()) {
        isBuilder.value = true

        console.log('%cBuilder mode enabled.', 'color: red; font-weight: bold;')
      }
    } catch (e) {
      isBuilder.value = false
    }
  }

  function sendLoadEvent() {
    if (isBuilder.value) {
      window.postMessage('@leaf:done', '*')
    }
  }

  return {
    check,
    isBuilder,
    sendLoadEvent,
  }
}
