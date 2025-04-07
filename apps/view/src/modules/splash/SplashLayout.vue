<script setup lang="ts">
import { useFooterNav } from './footer'

const { active } = useFooterNav()
</script>

<template>
  <div id="rootLayout" :class="{ footerVisible: active }" class="transition-cubic SplashLayout">
    <div class="SplashLayout-Main">
      <slot name="content" />
    </div>

    <!-- FOOTER -->
    <div class="SplashLayout-Footer fake-background transition-cubic">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SplashLayout {
  position: absolute;
  display: flex;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  overflow: hidden;
  flex-direction: column;
  color: var(--el-text-color-primary);

  --footer-height: 64px;
}

.SplashLayout-Footer {
  .footerVisible & {
    transform: translateY(0);
  }

  z-index: 100;
  position: absolute;

  bottom: 0;
  left: 0;

  width: 100%;
  height: var(--footer-height);

  --fake-opacity: 0.9;
  transform: translateY(100%);
  backdrop-filter: blur(18px) saturate(180%) brightness(120%);
}

.SplashLayout-Main {
  position: relative;

  flex: 1;
  height: 100%;

  max-height: 100%;

  overflow: hidden;

  // .footerVisible & {
  //   max-height: calc(100% - 64px);
  // }
}
</style>
