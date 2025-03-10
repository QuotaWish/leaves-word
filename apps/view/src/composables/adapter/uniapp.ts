const url = '//js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.0.1.52.js'

function createScript(url: string) {
  const script = document.createElement('script')
  script.src = url
  document.head.appendChild(script)
}

const UniEvent = Symbol('UNIAPP_HYBRID_MESSAGE_EVENT')

export const UniEventAtBackButton = Symbol('UNIAPP_HYBRID_MESSAGE_EVENT_AT_BACK_BUTTON')

export const uniEventBus = useEventBus(UniEvent)

export function useUniApp() {

  function intendHandler() {

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

  // function styleHandler() {

  // }

  function init(onReady: Function) {
    document.addEventListener('UniAppJSBridgeReady', () => {
      window.$uniMsg = messageHandler
      backHandler()

      console.log('UniAppJSBridgeReady - MessageHandler Done')

      onReady()
    })

    createScript(url)
  }

  function destroy() {
    window.plus.key.removeEventListener('backbutton', backHandler)
  }

  return {
    init,
    destroy
  }
}