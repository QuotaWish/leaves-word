import { GlobalInputMethodAPI } from './modules/globalInputMethod'

declare module 'vue' {
  interface ComponentCustomProperties {
    $inputMethod: GlobalInputMethodAPI
  }
} 