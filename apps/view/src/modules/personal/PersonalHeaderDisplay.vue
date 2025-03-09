<script setup lang="ts">

</script>

<template>
  <div class="PersonalHeaderDisplay">
    <div class="PersonalHeaderDisplay-Background">
      <img src="/logo.svg">
    </div>
    <div class="PersonalHeaderDisplay-Content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PersonalHeaderDisplay {
  width: 100%;
  height: 100%;

  &-Content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1rem;
    gap: 1rem;

    .statusbar & {
      padding-top: calc(1rem + 24px);
    }
  }
}

.PersonalHeaderDisplay-Background {
  position: absolute;
  width: 100%;
  height: 100%;
  --fake-opacity: 0;
  backdrop-filter: blur(100px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(to bottom, var(--theme-color), rgba(0, 0, 0, 0));
    pointer-events: none;
    opacity: 0.9;
    
    .light & {
      background-image: linear-gradient(to bottom, var(--theme-color), rgba(255, 255, 255, 0));
      opacity: 0.7;
    }
  }

  img {
    z-index: -1;
    position: absolute;
    left: 50%;
    bottom: 50%;
    width: 108px;
    height: 108px;
    opacity: 0.5;
    transform: translate(-50%, 50%);
    filter: grayscale(0.5) blur(2px) brightness(120%);
    
    .light & {
      opacity: 0.2;
      filter: grayscale(0.2) blur(1px) brightness(110%);
    }
  }

  .dark & {
    // 仅在暗色模式下添加更多的效果
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 50%);
      pointer-events: none;
      z-index: -1;
    }
  }
}
</style>
