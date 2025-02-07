<script setup lang="ts">

</script>

<template>
  <div class="WithPage">
    <div class="WithPage-Background absolute-layout -z-1">
      <slot name="bg" />
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.WithPage {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  .statusbar & {
    padding-top: 28px;
  }
}
</style>
