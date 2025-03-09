import { useStorage } from '@vueuse/core'
import DeveloperFloatingBall from './index.vue'

// 提供访问开发者模式设置的工具函数
export function useDevMode() {
  const devModeEnabled = useStorage('leaves-dev-mode-enabled', false)

  // 切换开发者模式
  function toggleDevMode() {
    devModeEnabled.value = !devModeEnabled.value
  }

  // 设置开发者模式
  function setDevMode(value: boolean) {
    devModeEnabled.value = value
  }

  return {
    devModeEnabled,
    toggleDevMode,
    setDevMode
  }
}

export { DeveloperFloatingBall }
export default DeveloperFloatingBall 