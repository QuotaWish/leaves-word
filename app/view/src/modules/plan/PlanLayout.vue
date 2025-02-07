<script setup lang="ts">

</script>

<template>
  <div class="PlanLayout">
    <div class="PlanLayout-Header">
      <slot name="header" />
    </div>

    <div class="PlanLayout-Main">
      <slot name="main" />
    </div>

    <div class="PlanLayout-Cover absolute-layout z-0">
      <slot name="cover" />
    </div>
  </div>
</template>

<style lang="scss">
.PlanLayout-Main {
  position: relative;

  width: 100%;
  height: calc(100% - 88px);
}

.PlanLayout {
  &-Header {
    z-index: 1;
    position: sticky;
    display: flex;
    padding: 0.5rem 1rem;

    top: 0;

    height: 64px;

    justify-content: space-between;

    .statusbar & {
      padding-top: calc(1rem + 24px);

      height: 88px;
    }
  }
  position: relative;

  height: 100%;

  overflow-y: scroll;
  background-color: var(--el-bg-color);
}
</style>
