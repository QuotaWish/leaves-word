<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import ScrollFadeContainer from './ScrollFadeContainer.vue'

const props = defineProps<{
  percentage: number
}>()

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

const shownCount = ref(1)
const containerRef = ref<any>(null)

watch(() => props.percentage, (newPercentage) => {
  const count = Math.ceil(newPercentage * messages.length)
  shownCount.value = Math.max(1, Math.min(count, messages.length))
  nextTick(() => {
    containerRef.value?.scrollToBottom?.()
  })
}, { immediate: true })

const displayedMessages = computed(() => messages.slice(0, shownCount.value))
</script>

<template>
  <ScrollFadeContainer ref="containerRef" max-height="60px">
    <div class="messages-wrapper">
      <transition-group
        name="message"
        tag="div"
        class="message-list"
      >
        <div
          v-for="(msg, index) in displayedMessages"
          :key="msg + index"
          class="message-item"
        >
          <span>{{ msg }}</span>
        </div>
      </transition-group>
    </div>
  </ScrollFadeContainer>
</template>

<style lang="scss" scoped>
.messages-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
}

.message-item {
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

/* 消息动画效果 */
.message-enter-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}
.message-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
  position: absolute;
}
.message-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.message-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.message-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
