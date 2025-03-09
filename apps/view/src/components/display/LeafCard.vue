<script setup lang="ts">
</script>

<template>
  <div class="LeafCard">
    <slot />
  </div>
</template>

<style lang="scss">
.LeafCard {
  &::before {
    content: '';
    position: absolute;

    width: 64px;
    height: 64px;

    right: 0.25rem;
    bottom: 0.25rem;

    border-radius: 50%;
    filter: blur(5px);
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 222, 89, 0.3) 0%,
      rgba(255, 222, 89, 0.1) 60%,
      transparent 100%
    );
  }

  position: relative;
  padding: 0.5rem 0;

  width: 100%;
  // height: 110px;

  border-radius: 12px;
  background: linear-gradient(125deg, var(--theme-color) 70%, var(--theme-color-dark));

  .dark & {
    background: linear-gradient(125deg, var(--theme-color-dark) 70%, var(--theme-color));
  }
}
</style>
