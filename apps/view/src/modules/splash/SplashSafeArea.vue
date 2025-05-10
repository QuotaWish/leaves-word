<script lang="ts" setup>
defineProps<{
  // 是否模拟一个白条
  mock?: boolean
  // 是否是 builder 模式
  builder?: boolean
}>()
</script>

<template>
  <div :class="{ mock, builder }" class="SplashSafeArea">
    <div class="SplashSafeArea-Mock transition-cubic" />
  </div>
</template>

<style lang="scss" scoped>
/* 添加CSS变量来处理安全区 */
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
}

.SplashSafeArea-Mock {
  .mock & {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(1px);
  }

  .dark & {
    background-color: var(--el-fill-color-darker);
  }

  &:active {
    background-color: var(--el-fill-color);

    transform: translate(-50%, -50%) translateY(1px) scaleX(0.75);
  }

  z-index: 1;
  position: absolute;

  top: 50%;
  left: 50%;

  width: 35%;
  height: 5px;

  opacity: 0;
  cursor: pointer;
  border-radius: 18px;
  // mix-blend-mode: difference;
  background-color: var(--el-text-color-primary);
  transform: translate(-50%, -50%) translateY(10px);
}

/* 基本样式 */
.SplashSafeArea {
  &::after {
    content: '';
    position: absolute;

    width: 100%;
    height: calc(var(--safe-area-inset-bottom) + 2px);

    left: 0;
    bottom: -4px;

    background-color: var(--el-bg-color);
  }

  z-index: 100000;
  position: relative;

  /* padding-top: var(--safe-area-inset-top); */
  /* padding-bottom: var(--safe-area-inset-bottom); */
  bottom: 0;
  height: var(--safe-area-inset-bottom);

  background-color: var(--el-bg-color);

  &.mock {
    --safe-area-inset-bottom: 12px;
  }

  &.builder {
    height: 44px;
  }
}

/* 针对iPhone全面屏设备的特殊适配 */
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-device-pixel-ratio: 3) {
  .splash-safe-area {
    padding-bottom: calc(var(--safe-area-inset-bottom) + 16px);
    /* 增加底部内边距以适应iPhone X及后续机型的Home Indicator */
  }
}

/* 针对非全面屏设备的适配 */
@media only screen and (max-device-width: 414px) and (-webkit-device-pixel-ratio: 3) and (not (min-device-height: 896px)) {
  .splash-safe-area {
    padding-bottom: 0;
    /* 对于非全面屏设备，不需要额外的底部内边距 */
  }
}
</style>
