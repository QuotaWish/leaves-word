<script setup lang="ts">
import WithPage from '~/components/page/WithPage.vue'
</script>

<template>
  <WithPage class="PlanLayout">
    <div class="PlanLayout-Header transition-cubic">
      <slot name="header" />
    </div>

    <div class="PlanLayout-Main">
      <slot name="main" />
    </div>

    <div class="PlanLayout-Cover transition-cubic absolute-layout z-0">
      <slot name="cover" />
    </div>
  </WithPage>
</template>

<style lang="scss">
.PlanLayout-Main {
  position: relative;

  width: 100%;
}

.PlanLayout {
  &-Header {
    z-index: 1;
    position: sticky;
    display: flex;
    padding: 0.5rem 1.5rem;

    top: 0;

    height: 64px;

    justify-content: space-between;

    // .statusbar & {
    //   padding-top: calc(1rem + 24px);

    //   height: 88px;
    // }
  }
  position: relative;

  height: 100%;

  overflow-y: scroll;
  background-color: var(--el-bg-color);
}
</style>
