import { ref } from 'vue'
import type { Ref } from 'vue'

interface MessageOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface MessageInstance {
  show: (message: string, options?: MessageOptions) => void
}

export function useMessage() {
  const messageRef = ref<MessageInstance | null>(null)

  function setMessageRef(ref: MessageInstance) {
    messageRef.value = ref
  }

  function show(message: string, options: MessageOptions = {}) {
    if (messageRef.value) {
      messageRef.value.show(message, options)
    }
  }

  function success(message: string, duration?: number) {
    show(message, { type: 'success', duration })
  }

  function error(message: string, duration?: number) {
    show(message, { type: 'error', duration })
  }

  function warning(message: string, duration?: number) {
    show(message, { type: 'warning', duration })
  }

  function info(message: string, duration?: number) {
    show(message, { type: 'info', duration })
  }

  return {
    setMessageRef,
    show,
    success,
    error,
    warning,
    info,
  }
}
