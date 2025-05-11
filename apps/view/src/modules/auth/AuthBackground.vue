<script setup lang="ts">

</script>

<template>
  <div class="AuthBackground absolute-layout">
    <div class="AuthBackground-Split" />
  </div>
</template>

<style lang="scss" scoped>
.AuthBackground {
  z-index: -1;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: url('/images/auth-bg.png') no-repeat;

  // background: linear-gradient(135deg, #f5f7fa, #c3cfe2);

  // .dark & {
  //   background: linear-gradient(135deg, #1f1f1f, #2d2d2d);
  // }
}
</style>
