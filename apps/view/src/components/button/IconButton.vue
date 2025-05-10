<script setup lang="ts">
const props = defineProps<{
  round?: boolean
  disabled?: boolean
}>()

const emits = defineEmits<{ (e: "click"): void }>()

function handleClick() {
  if (!props.disabled) {
    emits("click")
  }
}
</script>

<template>
  <div :class="{ disabled, round }" cursor-pointer class="IconButton" @click="handleClick">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.IconButton {
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &.round {
    padding: 0.125rem 0.5rem;
    display: flex;

    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    border-radius: 12px;
    background-color: var(--el-border-color-light);
  }

  user-select: none;
}
</style>
