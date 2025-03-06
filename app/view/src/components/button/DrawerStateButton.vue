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
  <button 
    class="drawer-button drawer-toggle-button"
    :class="{
      'is-fullscreen': state === DrawerState.FULLSCREEN,
      'is-expanded': state === DrawerState.EXPAND,
      'is-shrink': state === DrawerState.SHRINK,
      'is-visible': state === DrawerState.VISIBLE,
      'is-hide': state === DrawerState.HIDE
    }"
    @click="handleClick"
    @touchstart="handleLongPressStart" 
    @touchend="handleLongPressEnd"
    @mousedown="handleLongPressStart"
    @mouseup="handleLongPressEnd"
    @mouseleave="handleLongPressEnd">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      v-html="getStateIcon()">
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
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 1.0, 0.5, 1.4);
  position: relative;

  &.is-fullscreen {
    background: rgba(79, 195, 247, 0.2);
    border-color: rgba(79, 195, 247, 0.5);
    color: #4fc3f7;
  }
  
  &.is-expanded {
    background: rgba(97, 218, 251, 0.15);
    border-color: rgba(97, 218, 251, 0.4);
  }
  
  &.is-shrink {
    background: rgba(255, 255, 255, 0.15);
  }
  
  &.is-visible {
    background: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.25);
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
</style> 