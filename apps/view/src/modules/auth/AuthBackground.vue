<script setup lang="ts"></script>

<template>
  <div class="AuthBackground absolute-layout fake-background">
    <div class="AuthBackground-Mask" />
  </div>
</template>

<style lang="scss" scoped>
.AuthBackground {
  &-Mask {
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background: linear-gradient(to top, #358ee1 30%, #0000);
  }

  &::after {
    z-index: 1;
  }

  .dark & {
    filter: brightness(0.8);
  }

  z-index: -1;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("/images/auth-bg-zipped.png");

  // background: linear-gradient(135deg, #f5f7fa, #c3cfe2);

  // .dark & {
  //   background: linear-gradient(135deg, #1f1f1f, #2d2d2d);
  // }
}
</style>
