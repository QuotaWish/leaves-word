<script setup lang="ts">
import { floatingBubbleState } from "./index";

const status = reactive({
  prefer: "left",
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

  floatingBubbleState.value.init = true;
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

const DURATION = 500;
async function moveToTarget(
  targetX: number,
  initX: number,
  callback: (x: number) => void,
) {
  const step = DURATION / (targetX - initX);
  console.warn(
    `from ${initX} to ${targetX} with ${DURATION} and step for ${step}`,
  );
  let currentX = initX;

  while (!status.dragging && Math.abs(currentX - targetX) > 5) {
    currentX += step;
    callback(currentX);

    if (Math.random() >= 0.5) {
      await sleep(1);
    }
  }

  await sleep(1);

  callback(targetX);
}

const { x, y } = useDraggable(bubble, {
  initialValue: { x: 0, y: computedPosition.value.y },
  preventDefault: true,
  containerElement: container,
  onStart() {
    status.dragging = true;
  },
  onEnd() {
    status.dragging = false;

    const containerEl = container.value!;

    const width = containerEl.clientWidth;

    moveToTarget(
      status.prefer === "left" ? 0 : width - 50,
      x.value,
      (moveX) => {
        x.value = moveX;
      },
    );
  },
  onMove(position) {
    const containerEl = container.value!;

    const { x, y } = position;
    const height = containerEl.clientHeight;
    const width = containerEl.clientWidth;

    if (y < height * 0.1) {
      position.y = height * 0.1;
    } else if (Math.abs(height - y) < height * 0.15) {
      position.y = height * 0.85;
    }

    if (x < 0) {
      position.x = 0;
    } else if (x > width - 50) {
      position.x = width - 50;
    }

    status.prefer = x < width / 2 ? "left" : "right";
  },
});

watchEffect(() => {
  floatingBubbleState.value.pos.x = x.value;
  floatingBubbleState.value.pos.y = y.value;
});

async function handleClick() {
  status.expand = true;

  await sleep(3000);

  status.expand = false;
}
</script>

<template>
  <Teleport to="#rootMain" defer>
    <div
      ref="container"
      :class="{ dragging: status.dragging }"
      class="AIBubble-Container absolute-layout"
    >
      <div
        ref="bubble"
        class="AIBubble"
        :style="`--x: ${x}px; --y: ${y}px`"
        :class="{
          left: status.prefer === 'left',
          right: status.prefer === 'right',
          expand: status.expand,
        }"
        @click="handleClick"
      >
        <div class="ball-content"></div>
        <div class="ball-pulse"></div>
        <div class="ball-ring"></div>
        <!-- <div class="glow-overlay" v-if="isGlowing"></div> -->

        <!-- 位置提示 -->
        <!-- <div class="position-tip" v-if="isShowingPositionTip">
        <span>{{ stickyPosition === "left" ? "左侧" : "右侧" }}</span>
      </div> -->
      </div>

      <div
        class="AIBubble-Container-Placeholder transition-cubic absolute-layout z-10"
      >
        <div
          :class="{ active: status.prefer === 'left' }"
          class="AIBubble-Container-Placeholder-Left transition-cubic"
        />
        <div
          :class="{ active: status.prefer === 'right' }"
          class="AIBubble-Container-Placeholder-Right transition-cubic"
        />
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.AIBubble.left {
  transform: translateX(-50%);
}

.AIBubble.right {
  transform: translateX(50%);
}

.AIBubble-Container {
  z-index: 100;

  pointer-events: none;

  // background-color: #00000080;
}

@keyframes shinning {
  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 0.85;
  }
}

.AIBubble-Container-Placeholder {
  & > div {
    &.active {
      opacity: 0.85;
      animation: shinning 1s infinite;
      background-color: var(--el-border-color);
      box-shadow: 0 0 10px 2px var(--el-fill-color-light);
    }
    position: absolute;

    top: 10%;

    width: 30px;
    height: 80%;

    opacity: 0.5;
    border-radius: 18px;
    background-color: var(--el-fill-color);
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
  position: fixed;

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

  opacity: 0.25;
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

  &:hover,
  &.expand {
    opacity: 1;
    box-shadow:
      0 4px 20px rgba(79, 86, 255, 0.6),
      0 0 40px rgba(255, 73, 128, 0.4);
    transform: scale(1.05);

    .ball-pulse,
    .ball-ring {
      animation-play-state: running;
    }

    animation: glow-pulse 1s ease-out infinite;
  }

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
