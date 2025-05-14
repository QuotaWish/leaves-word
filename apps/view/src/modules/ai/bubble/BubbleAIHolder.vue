<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import Ai from "~/modules/ai/index.vue";
import { floatingBubbleState } from ".";

const props = defineProps<{
  expand: boolean;
}>();

const x = computed(() => floatingBubbleState.value.pos.x + 25);
const y = computed(() => floatingBubbleState.value.pos.y + 25);

// 计算最大半径
const endRadius = computed(() =>
  Math.hypot(
    Math.max(x.value, window.innerWidth - x.value),
    Math.max(y.value, window.innerHeight - y.value),
  ),
);

// 绑定 style
const calStyles = ref<Record<string, string>>({});

function updateClipPath(expand: boolean) {
  const radius = expand ? `${endRadius.value}px` : "0px";
  calStyles.value = {
    clipPath: `circle(${radius} at ${x.value}px ${y.value}px)`,
    transition: "clip-path 0.6s ease",
  };
}

// // 初始设置
// onMounted(() => {
//   updateClipPath(props.expand);
// });

// // 动画触发
// watch(
//   () => props.expand,
//   (newVal) => {
//     updateClipPath(newVal);
//   },
// );

watchEffect(() => {
  updateClipPath(props.expand);
});
</script>

<template>
  <RoutePage
    :class="{ expand: props.expand }"
    class="BubbleHolder absolute-layout z-10"
    :style="calStyles"
  >
    <Ai />

    <!-- <div class="BubbleAIHolder-Bottom">12333</div> -->
  </RoutePage>
</template>

<style lang="scss" scoped>
.BubbleHolder {
  will-change: clip-path;

  pointer-events: all;
  background-color: var(--el-fill-color);
}

.BubbleAIHolder-Bottom {
  position: absolute;

  left: 0;
  bottom: 0;

  width: 100%;
  height: 30%;

  mask: linear-gradient(to bottom, transparent, #000000);
}
</style>
