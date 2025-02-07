<script setup>
import PersonalModule from '~/modules/personal/index.vue'
</script>

<template>
  <div class="PersonalPage">
    <PersonalModule />
  </div>
</template>

<style lang="scss">
.PersonalPage {
  z-index: 1;
  position: relative;

  width: 100%;
  height: 100%;

  overflow-y: scroll;
  overflow-x: hidden;
}
</style>

<route lang="yaml">
meta:
  transition: nav
</route>
