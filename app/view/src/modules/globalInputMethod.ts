import { App, createApp, h } from 'vue'
import GlobalInputMethod from '../components/input/GlobalInputMethod.vue'

// 全局输入法插件
export const installGlobalInputMethod = (app: App) => {
  // 创建一个DOM容器
  const container = document.createElement('div')
  container.id = 'global-input-method-container'
  document.body.appendChild(container)

  // 创建全局状态
  const globalInputMethodState = {
    visible: false,
    targetInput: null as string | null,
    prompt: '', // 提示词
    soundUrl: '', // 声音URL
  }

  // 创建实例
  const inputMethodApp = createApp({
    render() {
      return h(GlobalInputMethod, {
        visible: globalInputMethodState.visible,
        'onUpdate:visible': (value: boolean) => {
          globalInputMethodState.visible = value
        },
        targetInput: globalInputMethodState.targetInput,
        prompt: globalInputMethodState.prompt,
        soundUrl: globalInputMethodState.soundUrl,
        onInput: (value: string) => {
          // 可以在这里处理全局输入事件
        },
        onReplaySound: () => {
          // 重播声音的回调
        }
      })
    }
  })

  // 挂载到容器
  inputMethodApp.mount(container)

  // 提供全局API
  const GlobalInputMethodAPI = {
    // 显示输入法
    show(targetSelector?: string, options?: {prompt?: string, soundUrl?: string}) {
      globalInputMethodState.visible = true
      if (targetSelector) {
        globalInputMethodState.targetInput = targetSelector
      }
      
      // 更新提示词和声音URL
      if (options) {
        if (options.prompt !== undefined) {
          globalInputMethodState.prompt = options.prompt
        }
        if (options.soundUrl !== undefined) {
          globalInputMethodState.soundUrl = options.soundUrl
        }
      }
    },
    
    // 隐藏输入法
    hide() {
      globalInputMethodState.visible = false
    },
    
    // 切换显示状态
    toggle(targetSelector?: string, options?: {prompt?: string, soundUrl?: string}) {
      if (targetSelector) {
        globalInputMethodState.targetInput = targetSelector
      }
      
      // 更新提示词和声音URL
      if (options) {
        if (options.prompt !== undefined) {
          globalInputMethodState.prompt = options.prompt
        }
        if (options.soundUrl !== undefined) {
          globalInputMethodState.soundUrl = options.soundUrl
        }
      }
      
      globalInputMethodState.visible = !globalInputMethodState.visible
    },
    
    // 更新提示词
    updatePrompt(prompt: string) {
      globalInputMethodState.prompt = prompt
    },
    
    // 更新声音URL
    updateSoundUrl(soundUrl: string) {
      globalInputMethodState.soundUrl = soundUrl
    },
    
    // 销毁输入法实例
    destroy() {
      inputMethodApp.unmount()
      container.remove()
    }
  }

  // 将API挂载到Vue全局属性
  app.provide('globalInputMethod', GlobalInputMethodAPI)
  app.config.globalProperties.$inputMethod = GlobalInputMethodAPI

  return GlobalInputMethodAPI
}

// 导出类型定义
export interface GlobalInputMethodAPI {
  show: (targetSelector?: string, options?: {prompt?: string, soundUrl?: string}) => void
  hide: () => void
  toggle: (targetSelector?: string, options?: {prompt?: string, soundUrl?: string}) => void
  updatePrompt: (prompt: string) => void
  updateSoundUrl: (soundUrl: string) => void
  destroy: () => void
}

// 导出插件
export default {
  install(app: App) {
    return installGlobalInputMethod(app)
  }
} 