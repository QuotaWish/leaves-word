<script setup lang="ts">
const props = withDefaults(defineProps<{
  displayCount?: number
  messageInterval?: number
  indicatorColor?: string
}>(), {
  displayCount: 1,
  messageInterval: 1500,
  indicatorColor: 'var(--theme-color)',
})

const messages = [
  'AI 正在分析词汇难度...',
  'AI 正在构建知识图谱...',
  'AI 正在优化学习路径...',
  'AI 正在生成记忆曲线...',
  'AI 正在分析语义关联...',
  'AI 正在计算复习间隔...',
  'AI 正在构建词根网络...',
  'AI 正在生成助记方案...',
  'AI 正在分析词频分布...',
  'AI 正在建立语义树...',
  'AI 正在训练记忆模型...',
  'AI 正在优化学习算法...',
  'AI 正在计算遗忘曲线...',
  'AI 正在生成复习计划...',
  'AI 正在分析相似词组...',
  'AI 正在构建例句库...',
  'AI 正在优化记忆策略...',
  'AI 正在生成智能提示...',
  'AI 正在分析学习模式...',
  'AI 正在准备开始学习...',
  'AI 正在为您定制学习计划...',
  'AI 正在处理词义关联...',
  'AI 正在提取核心词汇...',
  'AI 正在匹配最佳例句...',
  'AI 正在分析记忆规律...',
  'AI 正在构建单词家族...',
  'AI 正在评估学习难点...',
  'AI 正在生成助记图像...',
  'AI 正在优化发音提示...',
  'AI 正在构建情景联想...',
]

const displayedMessages = ref<string[]>([messages[0]])
const usedIndices = ref<Set<number>>(new Set([0]))
const isActive = ref(false)

function getRandomMessage(): string {
  if (usedIndices.value.size >= messages.length) {
    usedIndices.value.clear()
  }

  let index: number
  do {
    index = Math.floor(Math.random() * messages.length)
  } while (usedIndices.value.has(index))

  usedIndices.value.add(index)
  return messages[index]
}

function updateMessage(): void {
  isActive.value = true

  // 添加新消息并移除旧消息
  if (displayedMessages.value.length >= props.displayCount) {
    displayedMessages.value.shift()
  }
  displayedMessages.value.push(getRandomMessage())

  setTimeout(() => {
    isActive.value = false
  }, 300)
}

let timer: NodeJS.Timeout | null = null

onMounted(() => {
  timer = setInterval(updateMessage, props.messageInterval)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <div class="ai-messages-container">
    <div
      class="ai-indicator"
      :class="{ active: isActive }"
      :style="{ backgroundColor: indicatorColor }"
    >
      <div class="ai-indicator-dot"></div>
      <div class="ai-indicator-dot"></div>
      <div class="ai-indicator-dot"></div>
    </div>

    <div class="messages-wrapper">
      <transition-group name="slide-fade" tag="div">
        <div
          v-for="(msg, index) in displayedMessages"
          :key="msg + index"
          class="message-item"
        >
          <span>{{ msg }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-messages-container {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 22px;
  position: relative;
}

.ai-indicator {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  justify-content: center;
  transition: transform 0.2s ease;

  &.active {
    transform: scale(1.1);
  }

  .ai-indicator-dot {
    width: 2.5px;
    height: 2.5px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    animation: aiDotAnimation 1.4s infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

.messages-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.message-item {
  position: absolute;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  span {
    font-size: 13px;
    color: var(--el-text-color-primary);
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
  position: absolute;
}

.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@keyframes aiDotAnimation {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }

  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}
</style>



