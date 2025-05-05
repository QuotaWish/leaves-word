<script setup lang="ts">
import { defineExpose, nextTick, onMounted, ref } from 'vue'

interface Props {
  maxHeight?: string,
}

const props = withDefaults(defineProps<Props>(), {
  maxHeight: '100px',
})

const containerRef = ref<HTMLDivElement | null>(null)

function scrollToBottom(): void {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  })
}

defineExpose({ scrollToBottom })

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="ScrollFadeContainer relative w-full">
    <div
      class="relative overflow-y-auto no-user-scroll"
      :style="{
        maxHeight: props.maxHeight,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }"
      ref="containerRef"
      @wheel.prevent
      @touchmove.prevent
    >
      <div class="mask-container">
        <div class="ScrollFadeContainer-Content py-2">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mask-container {
  mask-image: linear-gradient(to bottom, transparent, black 5%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 5%, black 90%, transparent);
}

div::-webkit-scrollbar {
  display: none;
  width: 0;
}

.no-user-scroll {
  overscroll-behavior: contain;
  pointer-events: auto;
  /* 禁止用户手动滚动 */
  touch-action: none;
}
</style>
