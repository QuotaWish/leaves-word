<script setup lang="ts">
import { DrawerState } from '~/components/page/types'

// 定义按钮组件属性
const props = defineProps<{
  state: string
  onClick?: (e: Event) => void
  lastSlideDirection?: 'up' | 'down' | null // 添加滑动方向属性
}>()

// 定义要暴露的事件
const emit = defineEmits<{
  longPressStart: []
  longPressEnd: []
}>()

// 按照状态和滑动方向获取适当的图标
const getStateIcon = () => {
  // 如果提供了滑动方向，优先使用滑动方向决定图标
  if (props.lastSlideDirection) {
    // 如果是向上滑动且不是全屏状态，显示上箭头
    if (props.lastSlideDirection === 'up' && props.state !== DrawerState.FULLSCREEN) {
      return '<polyline points="18 15 12 9 6 15"></polyline>'; // 向上箭头
    }

    // 如果是向下滑动且不是可见状态，显示下箭头
    if (props.lastSlideDirection === 'down' && props.state !== DrawerState.VISIBLE) {
      return '<polyline points="6 9 12 15 18 9"></polyline>'; // 向下箭头
    }
  }

  // 如果没有滑动方向或是边界状态，根据当前状态确定箭头方向
  switch (props.state) {
    case DrawerState.FULLSCREEN:
      return '<polyline points="6 9 12 15 18 9"></polyline>'; // 向下箭头 - 已全屏状态只能向下
    case DrawerState.EXPAND:
      // 展开状态默认显示上箭头，因为可以继续向上到全屏
      return '<polyline points="18 15 12 9 6 15"></polyline>'; // 向上箭头
    case DrawerState.SHRINK:
      return '<polyline points="18 15 12 9 6 15"></polyline>'; // 向上箭头 - 收缩状态默认向上
    case DrawerState.VISIBLE:
      return '<polyline points="18 15 12 9 6 15"></polyline>'; // 向上箭头 - 可见状态只能向上
    case DrawerState.HIDE:
      return '<polyline points="18 15 12 9 6 15"></polyline>'; // 向上箭头 - 隐藏状态
    default:
      return '<polyline points="18 15 12 9 6 15"></polyline>'; // 默认向上箭头
  }
};

// 处理点击事件
const handleClick = (e: Event) => {
  e.stopPropagation();
  useVibrate('heavy');
  if (props.onClick) {
    props.onClick(e);
  }
};

// 处理长按开始
const handleLongPressStart = () => {
  emit('longPressStart');
};

// 处理长按结束
const handleLongPressEnd = () => {
  emit('longPressEnd');
};
</script>

<template>
  <button class="drawer-button drawer-toggle-button" :class="{
    'is-fullscreen': state === DrawerState.FULLSCREEN,
    'is-expanded': state === DrawerState.EXPAND,
    'is-shrink': state === DrawerState.SHRINK,
    'is-visible': state === DrawerState.VISIBLE,
    'is-hide': state === DrawerState.HIDE
  }" @click="handleClick" @touchstart="handleLongPressStart" @touchend="handleLongPressEnd"
    @mousedown="handleLongPressStart" @mouseup="handleLongPressEnd" @mouseleave="handleLongPressEnd">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="getStateIcon()">
    </svg>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.drawer-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 1.0, 0.5, 1.4);
  position: relative;

  filter: invert(1);

  &.is-fullscreen {
    background: rgba(0, 120, 170, 0.8);
    border-color: rgba(0, 140, 200, 0.5);
    color: rgba(255, 255, 255, 1);
  }

  &.is-expanded {
    background: rgba(20, 120, 160, 0.7);
    border-color: rgba(30, 140, 180, 0.4);
  }

  &.is-shrink {
    background: rgba(40, 40, 40, 0.7);
  }

  &.is-visible {
    background: rgba(50, 50, 50, 0.6);
  }

  &:hover {
    background: rgba(60, 60, 60, 0.9);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s cubic-bezier(0.25, 1.0, 0.5, 1.4);
  }

  &:active svg {
    transform: scale(0.9);
  }
}

// 暗色模式样式适配 - 反色对比
body.dark {
  .drawer-button {
    background: rgba(240, 240, 240, 0.8);
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(30, 30, 30, 0.9);

    filter: invert(0);

    &.is-fullscreen {
      background: rgba(100, 200, 250, 0.8);
      border-color: rgba(120, 210, 255, 0.5);
      color: rgba(10, 50, 80, 1);
    }
    
    &.is-expanded {
      background: rgba(120, 210, 250, 0.7);
      border-color: rgba(150, 220, 255, 0.4);
    }
    
    &.is-shrink {
      background: rgba(220, 220, 220, 0.7);
      border-color: rgba(200, 200, 200, 0.4);
    }
    
    &.is-visible {
      background: rgba(200, 200, 200, 0.6);
      border-color: rgba(180, 180, 180, 0.4);
    }

    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }
}
</style>