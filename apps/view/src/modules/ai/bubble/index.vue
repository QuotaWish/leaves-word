<script setup lang="ts">
import { floatingBubbleState } from "./index";

const status = reactive({
  expand: false,
  dragging: false,
});

const bubble = useTemplateRef("bubble");
const container = useTemplateRef("container");
const size = useElementSize(container);

// 默认是右下角
function initializePosition() {
  const startX = 50;
  const startY = size.height.value * 0.7 - 25;

  floatingBubbleState.value.pos = {
    x: startX,
    y: startY,
    layout: "right",
  };
}

onMounted(() => {
  if (!floatingBubbleState.value.init) {
    setTimeout(() => {
      initializePosition();
    }, 2000);
  }
});

const computedPosition = computed(() => {
  const pos = floatingBubbleState.value.pos;

  const startX = pos.layout === "left" ? 0 : size.width.value;

  return {
    x: startX + (pos.layout === "left" ? 1 : -1) * pos.x,
    y: pos.y,
  };
});

const { x, y, style } = useDraggable(bubble, {
  axis: "y",
  initialValue: { x: 0, y: computedPosition.value.y },
  preventDefault: true,
  containerElement: container,
  onStart() {
    status.dragging = true;
  },
  onEnd() {
    status.dragging = false;
  },
  onMove(position, event) {
    const containerEl = container.value!;

    const y = position.y;
    const height = containerEl.clientHeight;

    console.log(y, height);

    if (y < height * 0.2) {
      position.y = height * 0.2;
    } else if (Math.abs(height - y) > height * 0.2) {
      position.y = height * 0.8;
    }

    // 判断 不能超出两侧

    // const bubbleEl = bubble.value!;

    // const offsetTop = bubbleEl.offsetTop;
    // const { y } = event;
    // console.log(event);
    // console.dir(bubbleEl);

    // // position.y = y - offsetTop;

    // console.log("final y", position.y);
  },
});
</script>

<template>
  <Teleport to="#rootMain" defer>
    <div
      :class="{ dragging: status.dragging }"
      ref="container"
      class="AIBubble-Container absolute-layout"
    >
      <div
        class="AIBubble"
        :style="`--x: ${x}px; --y: ${y}px`"
        :class="{
          expand: status.expand,
        }"
        ref="bubble"
      >
        <div class="ball-content">
          <i class="i-mdi-robot text-xl"></i>
        </div>
        <div class="ball-pulse"></div>
        <div class="ball-ring"></div>
        <!-- <div class="glow-overlay" v-if="isGlowing"></div> -->

        <!-- 位置提示 -->
        <!-- <div class="position-tip" v-if="isShowingPositionTip">
        <span>{{ stickyPosition === "left" ? "左侧" : "右侧" }}</span>
      </div> -->
      </div>

      <div
        class="AIBubble-Container-Placeholder z-10 absolute-layout transition-cubic"
      >
        <div class="AIBubble-Container-Placeholder-Left transition-cubic" />
        <div class="AIBubble-Container-Placeholder-Right transition-cubic" />
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.AIBubble-Container {
  z-index: 100;

  pointer-events: none;

  // background-color: #00000080;
}

.AIBubble-Container-Placeholder {
  & > div {
    position: absolute;

    top: 10%;

    width: 30px;
    height: 80%;

    opacity: 0.75;
    border-radius: 18px;
    background-color: var(--el-border-color);
  }

  &-Left {
    left: 1rem;
  }

  &-Right {
    right: 1rem;
  }

  .AIBubble-Container.dragging & {
    opacity: 1;

    backdrop-filter: blur(18px) saturate(180%);
  }

  opacity: 0;
}

.AIBubble {
  position: absolute;

  top: var(--y);
  left: var(--x);

  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f56ff, #ff4980);
  box-shadow:
    0 2px 15px rgba(79, 86, 255, 0.5),
    0 0 30px rgba(255, 73, 128, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  user-select: none;
  touch-action: none;
  cursor: pointer;
  transition:
    width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    border-radius 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;

  pointer-events: all;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0)
    );
    border-radius: 50%;
    z-index: 1;
  }

  &:hover {
    box-shadow:
      0 4px 20px rgba(79, 86, 255, 0.6),
      0 0 40px rgba(255, 73, 128, 0.4);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  // 拖动状态样式
  &.dragging {
    transition: none !important; // 拖动时完全禁用所有过渡效果

    * {
      transition: none !important; // 确保子元素也禁用过渡
    }

    opacity: 0.8;
    transform: scale(1.05);

    .ball-content {
      transform: scale(0.9);
    }
  }

  // 左侧贴边样式
  &.stick-left {
    left: 0 !important;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;

    &.collapsed {
      transform: translateX(-60%);

      &:hover:not(.dragging) {
        transform: translateX(-55%) scale(1.05);
      }

      &:active:not(.dragging) {
        transform: translateX(-55%) scale(0.95);
      }
    }
  }

  // 右侧贴边样式
  &.stick-right {
    right: 0 !important;
    left: auto !important;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;

    &.collapsed {
      transform: translateX(60%);

      &:hover:not(.dragging) {
        transform: translateX(55%) scale(1.05);
      }

      &:active:not(.dragging) {
        transform: translateX(55%) scale(0.95);
      }
    }
  }

  // 收缩状态样式
  &.collapsed {
    width: 30px;
    height: 30px;
    opacity: 0.7;

    .ball-content {
      transform: scale(0.7);
    }

    .ball-pulse,
    .ball-ring {
      animation-play-state: paused;
    }

    &:hover:not(.dragging) {
      opacity: 0.9;
    }
  }

  // 展开状态样式
  &.expanded {
    width: 50px;
    height: 50px;
    opacity: 1;
    transform: translateX(0);

    .ball-content {
      transform: scale(1);
    }

    .ball-pulse,
    .ball-ring {
      animation-play-state: running;
    }
  }

  .ball-content {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 3;
    transition: transform 0.3s ease;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  // 脉冲效果
  .ball-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 0;
    z-index: 2;
    animation: pulse 2s ease-in-out infinite;
  }

  // 外环效果
  .ball-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-sizing: border-box;
    z-index: 0;
    animation: rotate 10s linear infinite;
  }

  // 炫光效果
  &.glow-effect {
    animation: glow-pulse 1s ease-out;
  }

  // 炫光叠加层
  .glow-overlay {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    border-radius: 50%;
    z-index: 4;
    pointer-events: none;
    animation: glow-overlay 1s ease-out forwards;
  }

  // 位置提示
  .position-tip {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    animation: fade-in-out 2s ease-in-out forwards;
    z-index: 5;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  50% {
    opacity: 0.2;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

// 炫光脉冲动画
@keyframes glow-pulse {
  0% {
    box-shadow:
      0 0 5px rgba(79, 86, 255, 0.5),
      0 0 10px rgba(255, 73, 128, 0.3);
  }

  50% {
    box-shadow:
      0 0 40px rgba(79, 86, 255, 0.9),
      0 0 80px rgba(255, 73, 128, 0.8);
    transform: scale(1.1);
  }

  100% {
    box-shadow:
      0 0 5px rgba(79, 86, 255, 0.5),
      0 0 10px rgba(255, 73, 128, 0.3);
  }
}

// 炫光叠加层动画
@keyframes glow-overlay {
  0% {
    opacity: 0.9;
    transform: scale(0.3);
  }

  50% {
    opacity: 0.7;
  }

  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}

// 提示淡入淡出动画
@keyframes fade-in-out {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
