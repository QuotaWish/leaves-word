<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  message: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
})

const visible = ref(false)
let timer: number | null = null

function show() {
  visible.value = true
  if (timer) {
    clearTimeout(timer)
  }
  timer = window.setTimeout(() => {
    visible.value = false
  }, props.duration)
}

function hide() {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

defineExpose({
  show,
  hide,
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg"
      :class="{
        'bg-green-500 text-white': type === 'success',
        'bg-red-500 text-white': type === 'error',
        'bg-yellow-500 text-white': type === 'warning',
        'bg-blue-500 text-white': type === 'info',
      }"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
