<script setup lang="ts">
defineProps<{
  type: "success" | "warning" | "danger";
}>();
</script>

<template>
  <div
    :class="[type]"
    flex
    items-center
    gap-2
    class="RoundInfo fake-background"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.RoundInfo.danger {
  --c: var(--el-color-danger);
}

.RoundInfo.warning {
  --c: var(--el-color-warning);
}

.RoundInfo.success {
  --c: #40a244; //var(--el-color-success);
}

.RoundInfo {
  z-index: 1;
  position: relative;
  padding: 0.4rem 0.75rem;

  font-size: 1em;
  font-weight: 600;
  user-select: none;
  border-radius: 16px;
  color: var(--c);
  --fake-opacity: 0.25;
  --fake-color: var(--c, var(--el-fill-color-lighter));

  backdrop-filter: blur(18px) saturate(180%) brightness(95%);
}
</style>
