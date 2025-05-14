<script setup lang="ts">
const props = defineProps<{
  active: boolean;
  order: number;
  topOrder: number;
}>();

const emits = defineEmits(["next"]);

const DRAG_RANGE = 100;

const dragger = useTemplateRef("item");
const options = reactive({
  centerX: 0,
  centerY: 0,
  init: false,
  hide: false,
  dragging: false,
});
const { width, height } = useElementSize(dragger);

const { x, y } = useDraggable(dragger, {
  containerElement: () => {
    return dragger.value?.parentElement;
  },
  onStart() {
    if (!props.active) {
      return false;
    }

    options.dragging = true;
  },
  async onEnd() {
    options.dragging = false;

    /**
     * 如果没有超过界限，回归
     */
    if (
      Math.abs(x.value - options.centerX) < DRAG_RANGE &&
      Math.abs(y.value - options.centerY) < DRAG_RANGE
    ) {
      x.value = options.centerX;
      y.value = options.centerY;
    } else {
      options.hide = true;

      await sleep(300);

      emits("next");

      await sleep(300);

      x.value = options.centerX;
      y.value = options.centerY;

      await sleep(300);

      options.hide = false;
    }
  },
  onMove() {},
});

function resetPosition() {
  const draggerEl = dragger.value!;
  const holder = draggerEl.parentElement!;

  const containerWidth = holder.clientWidth;
  const containerHeight = holder.clientWidth;

  x.value = containerWidth / 2 - width.value / 2;
  y.value = containerHeight / 2 + height.value / 2;

  options.centerX = x.value;
  options.centerY = y.value;
}

onMounted(() => {
  resetPosition();

  options.init = true;
});

const style = computed(() => {
  if (options.hide) {
    return `transition: 0.25s ease-out; opacity: 0;transform: scale(0.85);--item-x: ${x.value}px;--item-y: ${y.value}px`;
  }

  const order = props.order;
  const topOrder = props.topOrder;
  const relativeOrder = Math.abs(order - topOrder);

  const zIndex = 4 - relativeOrder;
  const scale = 0.1 * relativeOrder;
  const offsetY = 5 * relativeOrder;
  const opacity = 0.25 * (4 - relativeOrder);

  return `transition: ${options.dragging ? "none" : "0.25s ease-out"}; opacity: ${opacity === 0 ? 0 : 1};transform-origin: center bottom;transform: scale(${1 - scale}) translateY(${offsetY}px);z-index: ${zIndex};--item-x: ${x.value}px;--item-y: ${y.value}px`;
});
</script>

<template>
  <div
    :class="{
      init: options.init,
      active,
      dragging: options.dragging,
    }"
    :style="style"
    ref="item"
    class="DraggableItem"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.DraggableItem {
  &.dragging {
    box-shadow: var(--el-box-shadow);
  }
  &.init {
    visibility: inherit;
  }
  position: absolute;

  top: var(--item-y);
  left: var(--item-x);

  width: 200px;
  height: 200px;

  visibility: hidden;

  cursor: grab;
  overflow: hidden;
  user-select: none;
  border-radius: 18px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
}
</style>
