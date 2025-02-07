<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const active = ref(false)
const router = useRouter()
const progress = ref(100)
const redirectTimer = ref(15)

function goHome() {
  router.push('/')
}

onActivated(() => {
  active.value = true
  redirectTimer.value = 15

  const interval = setInterval(() => {
    progress.value -= 100 / 15
    redirectTimer.value--

    if (redirectTimer.value <= 0) {
      clearInterval(interval)
      router.push('/')
    }
  }, 1000)
})

onDeactivated(() => {
  active.value = false
})
</script>

<template>
  <teleport :disabled="!active" to="#rootMain">
    <div class="absolute left-0 top-0 z-10 h-full w-full overflow-hidden">
      <!-- Rainbow background with blur -->
      <div class="bg-gradient animate-gradient absolute inset-0 opacity-20 dark:opacity-10" />

      <div class="relative h-full w-full flex flex-col items-center justify-center px-6">
        <div class="max-w-sm w-full text-center space-y-8">
          <div class="animate-text-gradient from-pink-500 via-purple-500 to-blue-500 bg-gradient-to-r bg-clip-text text-8xl text-transparent font-bold">
            404
          </div>

          <h1 class="text-2xl text-gray-800 font-medium dark:text-gray-200">
            页面未找到
          </h1>

          <p class="text-gray-600 dark:text-gray-400">
            您访问的页面可能已被移除或暂时无法访问
          </p>

          <!-- Progress bar -->
          <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200/50 backdrop-blur-sm dark:bg-gray-700/50">
            <div
              class="h-full rounded-full from-pink-500 via-purple-500 to-blue-500 bg-gradient-to-r transition-all duration-1000 transition-ease-linear"
              :style="{ width: `${progress}%` }"
            />
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ redirectTimer }}秒后自动返回首页
          </p>

          <button
            class="w-full rounded-full from-pink-500 via-purple-500 to-blue-500 bg-gradient-to-r px-6 py-3 text-white shadow-lg backdrop-blur-sm transition-all duration-300 active:scale-[0.98] hover:scale-[1.02] hover:shadow-xl"
            @click="goHome"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.animate-gradient {
  background: linear-gradient(-45deg, #ff69b4, #9c27b0, #3f51b5, #00bcd4, #4caf50, #ffeb3b, #ff5722);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

.animate-text-gradient {
  filter: blur(1px);

  background-size: 200% auto;
  animation: textGradient 5s linear infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes textGradient {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
