<script setup lang="ts">
const props = defineProps<{
  color: string
  disabled: boolean
}>()
</script>

<template>
  <div v-wave :class="{ disabled }" class="RoundButton fake-background">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.RoundButton {
  :deep(& > *) {
    width: 100%;
    height: 100%;
  }
  &.disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
  --fake-color: v-bind(color);

  position: relative;
  display: flex;

  width: 64px;
  height: 64px;

  align-items: center;
  justify-content: center;

  font-size: 20px;

  --fake-opacity: 0.75;

  cursor: pointer;
  border-radius: 50%;
  backdrop-filter: blur(18px) saturate(180%);
}
</style>
