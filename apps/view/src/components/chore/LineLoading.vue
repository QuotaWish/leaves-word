<script setup lang="ts">
defineProps < {
  progress: number
}>()
</script>

<template>
  <div :style="`--p: ${progress}%`" :class="{ loading: progress === -1 }" class="LineLoading">
    <div class="LineLoading-Inner transition-cubic" />
  </div>
</template>

<style lang="scss">
@keyframes inner-loading {
  0% {
    left: 0;
    width: 0;
  }

  10% {
    left: 0;
    width: 10%;
  }

  40% {
    left: 0%;
    width: 50%;

    transform: translateX(0);
  }

  60% {
    left: 100%;
    width: 50%;

    transform: translateX(-50%);
  }

  90% {
    left: 100%;
    width: 10%;

    transform: translateX(-10%);
  }

  100% {
    left: 100%;
    width: 0;

    transform: translateX(0);
  }
}

.LineLoading {
  &-Inner {
    .LineLoading.loading & {
      animation: inner-loading 0.75s alternate-reverse linear infinite;
    }
    position: absolute;

    top: 0;
    left: 0;

    width: var(--p, 0);
    height: 100%;

    border-radius: 2px;
    background-color: var(--theme-color);
  }

  &::before {
    content: '';
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    opacity: 0.25;
    background-color: var(--theme-color);
  }
  position: relative;

  width: 100%;
  height: 10px;

  overflow: hidden;
  border-radius: 2px;
}
</style>
