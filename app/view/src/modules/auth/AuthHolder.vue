<script setup lang="ts">
import { globalAuthStorage } from '.'
</script>

<template>
  <teleport defer to="#rootMain">
    <div :class="{ display: !globalAuthStorage.isLogin }" class="AuthHolder transition-cubic absolute-layout">
      <slot />
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.AuthHolder {
  &.display {
    border-radius: 0;
    transform: translateY(0) scale(1);
  }

  z-index: 100;

  border-radius: 18px;
  transform: translateY(120%) scale(0.8);
  background-color: var(--el-bg-color);

  transition-duration: 0.75s;
}
</style>
