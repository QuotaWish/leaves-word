<script setup lang="ts">
defineProps<{
  progress: number;
}>();
</script>

<template>
  <div :style="`--p: ${progress * 100}%`" class="LineProgress">
    <div class="LineProgress-Bg" />
    <div v-if="progress" class="transition-cubic LineProgress-Inner" />
  </div>
</template>

<style lang="scss">
.LineProgress {
  position: relative;
  width: 90%;
  height: 8px;
  // margin: 8px 0;

  // --progress-color: #028d81;
  // --progress-color-dark: #179bc2;

  --progress-color: var(--theme-color-primary);
  --progress-color-dark: var(--theme-color-dark);

  .LineProgress-Bg {
    position: absolute;
    inset: 0;
    opacity: 0.8;
    border-radius: 12px;
    background-color: vary(--progress-color);
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.2),
        rgba(255, 255, 255, 0.05)
      );
    }
  }

  .LineProgress-Inner {
    position: absolute;
    width: var(--p);
    height: 100%;
    border-radius: 12px;
    background: linear-gradient(90deg, var(--progress-color), var(--progress-color-dark));
    box-shadow: 0 0 10px var(--progress-color);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: shimmer 2s linear infinite;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 3px;
      height: 100%;
      background: var(--theme-color-light);
      opacity: 0.3;
      filter: blur(1px);
    }
  }
}
</style>
