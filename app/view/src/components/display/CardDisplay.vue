<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

interface Props {
  colors?: string[] // 接收颜色数组
  direction?: string // 可选的渐变方向
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ['#e6f7ff', '#f0f5ff'],
  direction: 'to right',
})

const gradientStyle = computed(() => {
  const colorStops = props.colors.map((color, index) => {
    const percentage = (index / (props.colors.length - 1)) * 100
    return `${color} ${percentage}%`
  }).join(', ')

  return `linear-gradient(${props.direction}, ${colorStops})`
})

const ins = getCurrentInstance()
const hasIcon = computed(() => ins?.slots?.icon)
</script>

<template>
  <div class="CardDisplay">
    <div v-if="hasIcon" class="card-icon">
      <slot name="icon" />
    </div>
    <div class="card-content">
      <div v-if="ins?.slots?.header" class="card-header">
        <slot name="header" />
      </div>
      <div class="card-main p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.CardDisplay {
  position: relative;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background: #fff;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  isolation: isolate;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, 0.98);
  }
}

.card-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 45%;
  height: 45%;
  z-index: 0;
  opacity: 0.15;
  font-size: 32px;
  transform: rotate(-28deg) scale(1.2) translateX(25%) translateY(25%);
  transition: all 0.4s ease;
  pointer-events: none;

  :deep(svg) {
    width: 100%;
    height: 100%;
    fill: currentColor;
    color: var(--theme-color, #000);
    filter: saturate(0.9) brightness(1.05);
  }

  .CardDisplay:hover & {
    transform: rotate(-5deg) scale(1.25) translateX(8%) translateY(8%);
    opacity: 0.2;
  }
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;

  opacity: 0.95;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

.card-header {
  &::before {
    z-index: -1;
    position: absolute;
    content: '';

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    filter: opacity(0.8) brightness(120%);
    background: v-bind(gradientStyle); // linear-gradient(to bottom, var(--theme-color), #0000);
    -webkit-mask-image: linear-gradient(to bottom, #000, transparent);
    mask-image: linear-gradient(to bottom, #000, transparent);
  }
  z-index: 1;
  position: relative;
  padding: 1rem;

  display: flex;
  align-items: center;
  gap: 8px;

  height: 40px;
  color: #262626;
  font-weight: 600;
}

.card-main {
  line-height: 1.6;
  color: var(--text-color, #666);

  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.01);
  }
}
</style>
