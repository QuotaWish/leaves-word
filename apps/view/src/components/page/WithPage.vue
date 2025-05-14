<script setup lang="ts">
import { IWIthPageProps } from "./types";

withDefaults(defineProps<IWIthPageProps>(), {
  adapt: true,
});
</script>

<template>
  <div :class="{ adapt }" class="WithPage">
    <div class="WithPage-Background absolute-layout -z-1">
      <slot name="bg" />
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.WithPage {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  .statusbar &.adapt {
    padding-top: 44px;
  }

  .statusbar .builder &.adapt {
    padding-top: 44px;
  }

  .footerVisible & {
    padding-bottom: var(--footer-height);
  }

  // .fullscreen & {
  //   padding-top: 44px;
  // }

  .statusbar .iPhone16 &.adapt {
    padding-top: 44px;
  }
}
</style>
