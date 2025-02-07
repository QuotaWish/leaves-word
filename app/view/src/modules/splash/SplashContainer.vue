<script setup lang="ts">
import { ScreenMode, useGlobalSplashState } from '.'
import SplashSafeArea from './SplashSafeArea.vue'
import SplashStatusbar from './SplashStatusbar.vue'

const spalshState = useGlobalSplashState()

const isMobile = computed(() => spalshState.screenMode.value === ScreenMode.MOBILE)
const mockStatusbar = computed(() => spalshState.mockStatusbar.value)
</script>

<template>
  <div class="SplashContainer" :class="{ 'statusbar': mockStatusbar, 'fullscreen': isMobile, 'wrapped-box': !isMobile }">
    <div id="rootApp" relative h-full w-full flex flex-col class="SplashContainer-Main">
      <SplashStatusbar :mock="mockStatusbar" />
      <slot />
      <SplashSafeArea :mock="!isMobile" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SplashContainer {
  &.wrapped-box {
    .SplashContainer-Main {
      // iPhone 12 Pro
      width: 390px;
      height: 844px;

      overflow: hidden;
      border-radius: 38px;
      box-shadow: var(--el-box-shadow);
      border: 5px solid var(--el-text-color-primary);
    }

    display: flex;

    align-items: center;
    justify-content: center;
  }

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  max-height: 100vh;
}
</style>
