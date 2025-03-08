<script setup lang="ts">

</script>

<template>
  <div class="WordSection fake-background">
    <div class="WordSection-decorations">
      <div class="leaf leaf-1" />
      <div class="leaf leaf-2" />
    </div>
    <div class="WordSection-Tag">
      <slot name="Tag" />
    </div>
    <div class="WordSection-Main">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.WordSection {
  position: relative;
  margin: 0.5rem 0;
  padding: 0.75rem;
  width: 100%;
  border-radius: 18px;
  // overflow: hidden;
  isolation: isolate;

  // 渐变背景
  // background: linear-gradient(135deg, var(--el-fill-color) 0%, var(--el-fill-color-lighter) 100%);

  // // 暗色模式
  // @media (prefers-color-scheme: dark) {
  //   background: linear-gradient(135deg, var(--el-fill-color) 0%, var(--el-fill-color-darker) 100%);
  // }

  // 玻璃态效果
  backdrop-filter: blur(18px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &::after {
    background: linear-gradient(135deg, rgba(152, 251, 152, 0.15), rgba(144, 238, 144, 0.1), rgba(173, 255, 47, 0.08));
    border-radius: inherit;
  }

  &-Tag {
    position: relative;
    padding: 0.25rem 0.5rem;
    width: max-content;
    font-size: 14px;
    border-radius: 8px;
    color: var(--el-text-color-regular);
    background-color: var(--el-fill-color-darker);
    z-index: 1;
  }

  &-Main {
    position: relative;
    padding: 0.5rem 0;
    z-index: 1;
  }

  // 装饰树叶
  &-decorations {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
  }

  .leaf {
    position: absolute;
    background-size: contain;
    background-repeat: no-repeat;

    &-1 {
      top: -10px;
      right: 10%;
      transform: rotate(15deg);
      animation: floatLeaf1 8s ease-in-out infinite;
    }

    &-2 {
      width: 80px;
      height: 80px;
      bottom: -15px;
      right: -15px;
      opacity: 0.1;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23228B22" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>');
      transform: rotate(15deg);
      animation: floatBigLeaf 12s ease-in-out infinite;
    }
  }
}

@keyframes floatLeaf1 {
  0%,
  100% {
    transform: rotate(15deg) translateY(0);
  }
  50% {
    transform: rotate(20deg) translateY(-5px);
  }
}

@keyframes floatBigLeaf {
  0%,
  100% {
    transform: rotate(15deg) scale(1);
  }
  50% {
    transform: rotate(20deg) scale(1.05);
  }
}
</style>
