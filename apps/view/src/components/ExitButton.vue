<script setup lang="ts">

</script>

<template>
  <div class="ExitButton">
    <slot />
  </div>
</template>

<style lang="scss">
.ExitButton {
  display: flex;

  width: 36px;
  height: 36px;

  align-items: center;
  justify-content: center;

  border-radius: 12px;
  background-color: var(--theme-color);
  border: 1px solid var(--theme-color-light);
  box-shadow: 1px 2px 1px 0 var(--theme-color-light);
}
</style>
