<script setup lang="ts">
import { ScreenMode, useGlobalSplashState } from '.'
import SplashSafeArea from './SplashSafeArea.vue'
import SplashStatusbar from './SplashStatusbar.vue'
import SplashWrapper from './SplashWrapper.vue'

const spalshState = useGlobalSplashState()

const isMobile = computed(() => spalshState.screenMode.value !== ScreenMode.WRAPPED)
const mockStatusbar = computed(() => spalshState.mockStatusbar.value)
</script>

<template>
  <div class="SplashContainer" :class="{ 'statusbar': mockStatusbar || spalshState.screenMode.value === ScreenMode.BUILDER, 'fullscreen': isMobile, 'wrapped-box': !isMobile }">
    <div class="SplashMenu transition-cubic">
      <slot name="menu" />
    </div>

    <SplashWrapper id="rootApp" relative h-full w-full flex flex-col class="SplashContainer-Main">
      <SplashStatusbar :mock="mockStatusbar" />
      <slot />
      <SplashSafeArea :mock="!isMobile" :builder="spalshState.screenMode.value === ScreenMode.BUILDER" />
    </SplashWrapper>
  </div>
</template>

<style lang="scss" scoped>
.SplashContainer {
  .SplashMenu {
    z-index: 10000;
    position: absolute;

    top: 0;
    left: 0;

    height: 44px;
    width: 100%;

    background-color: var(--el-fill-color-lighter);
  }

  &.fullscreen .SplashMenu {
    display: none;
  }

  &.wrapped-box {
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
