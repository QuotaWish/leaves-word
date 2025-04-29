import { createApp } from "vue"
import GameAward from "./GameAward.vue"

export type AwardType = 'words' | 'questions' | 'time'

/**
 * 将会创造奖励机会
 * 可以设置是否允许抵消，即重启页面后仍然存在！
 * deduct是
 */
export function tryAward(type: AwardType, desc: string, options: {
  cnt: number,
  deduct?: boolean,
}) {
  return new Promise(resolve => {
    const el = document.createElement('div')

    el.style.position = 'absolute'
    el.style.top = '0'
    el.style.left = '0'
    el.style.width = '100%'
    el.style.height = '100%'

    el.style.zIndex = '9999'
    el.style.background = 'rgba(0, 0, 0, 0.5)'
    document.body.appendChild(el)

    setTimeout(() => {
      el.addEventListener('scroll', (e) => e.preventDefault())
      // el.addEventListener('touchstart', (e) => {
      //   // e.preventDefault()
      //   e.stopImmediatePropagation()
      // })

      window._ignore = true
    })

    function _close() {
      app.unmount()

      el.remove()

      window._ignore = false
    }

    const app = createApp(GameAward, {
      close: (doSuccess: boolean) => {
        _close()

        resolve(doSuccess)
      },
      type,
      desc,
      count: options.cnt,
      deduct: options.deduct,
    })

    app.mount(el)
  })
}
