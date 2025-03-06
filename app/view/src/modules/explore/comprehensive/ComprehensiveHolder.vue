<script setup lang="ts">

</script>

<template>
  <SideNavHolder title="综合提升">
    <template #nav>
      <slot name="nav" />
    </template>
    <template #main>
      <slot />
    </template>
    <slot />
  </SideNavHolder>
</template>

<style lang="scss" scoped>

</style>
