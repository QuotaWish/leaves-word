<script lang="ts" setup>
import JSConfetti from 'js-confetti'

const canvas = ref<HTMLCanvasElement>()
const cofetti = ref()

onMounted(() => {
  cofetti.value = new JSConfetti({
    canvas: canvas.value!,
  })

  // 创建一个函数来发射单次 confetti
  const shootConfetti = () => {
    // 左侧喷发
    cofetti.value.addConfetti({
      particleCount: 50,
      spread: 70,
      origin: {
        x: 0.1,
        y: 0.5,
      },
    })
    // 右侧喷发
    cofetti.value.addConfetti({
      particleCount: 50,
      spread: 70,
      origin: {
        x: 0.9,
        y: 0.5,
      },
    })
  }

  // 设置定时器，每 200ms 发射一次，持续 5 秒
  const interval = setInterval(shootConfetti, 350)

  // 5 秒后清除定时器
  setTimeout(() => {
    clearInterval(interval)
  }, 3500)
})
</script>

<template>
  <div class="CoffettiParticle w-full h-full">
    <canvas ref="canvas" class="w-full h-full" />
  </div>
</template>