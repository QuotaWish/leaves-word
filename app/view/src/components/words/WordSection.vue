<script setup lang="ts">

</script>

<template>
  <div class="WordSection">
    <div class="WordSection-Tag">
      <slot name="Tag" />
    </div>
    <div class="WordSection-Main">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.WordSection-Tag {
  padding: 0.25rem 0.5rem;

  width: max-content;

  font-size: 14px;
  border-radius: 8px;
  color: var(--el-text-color-regular);
  background-color: var(--el-fill-color-darker);
}

.WordSection {
  &-Main {
    padding: 0.5rem 0;
  }
  position: relative;
  margin: 0.5rem 0;
  padding: 0.75rem;

  width: 100%;

  border-radius: 18px;
  background-color: var(--el-fill-color);
}
</style>
