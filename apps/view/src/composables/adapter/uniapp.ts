import { ScreenMode, useGlobalSplashState } from "~/modules/splash"

const url = '//js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.0.1.52.js'

function createScript(url: string) {
  const script = document.createElement('script')
  script.src = url
  document.head.appendChild(script)
}

const UniEvent = Symbol('UNIAPP_HYBRID_MESSAGE_EVENT')
const globalSplashState = useGlobalSplashState()

export const UniEventAtBackButton = Symbol('UNIAPP_HYBRID_MESSAGE_EVENT_AT_BACK_BUTTON')

export const uniEventBus = useEventBus(UniEvent)

export function useUniApp() {
  const scope = new EffectScope()

  function intendHandler() {

  }

  function styleHandler() {
    watch(() => isDark.value, () => {
      if (isDark.value) {
        window.plus.navigator.setStatusBarStyle('light')
      } else {
        window.plus.navigator.setStatusBarStyle('dark')
      }
    }, { immediate: true })
  }

  function backHandler() {
    window.plus.key.setAssistantType('none')

    window.plus.key.addEventListener('backbutton', () => {
      uniEventBus.emit(UniEventAtBackButton, {})
    })
  }

  function messageHandler(message: string) {
    try {
      const data = JSON.parse(message)
      uniEventBus.emit(data?.event, data)

      console.log('messageHandler', data)
    } catch (e) {
      console.error(`messageHandler error: ${e}`)
    }
  }

  function postMessage(event: string, data?: any) {
    window.postMessage({
      event,
      data
    }, '*')
  }

  // function styleHandler() {

  // }

  function init(onReady: Function) {
    document.addEventListener('UniAppJSBridgeReady', () => {
      globalSplashState.screenMode.value = ScreenMode.BUILDER

      window.$uniMsg = messageHandler
      backHandler()

      onReady()

      postMessage('@leaf:done')

      scope.run(() => {
        styleHandler()

        console.log('styleHandler done')
      })
    })

    createScript(url)
  }

  function destroy() {
    console.log('destroy')
    window.plus.key.removeEventListener('backbutton', backHandler)

    scope.stop()
  }

  return {
    init,
    destroy
  }
}