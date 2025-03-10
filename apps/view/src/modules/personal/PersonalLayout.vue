<script setup lang="ts">
import WithHeadPage from '~/components/page/WithHeadPage.vue';


</script>

<template>
  <WithHeadPage :adapt="false" class="PersonalLayout">
    <header class="header">
      <slot name="header" />
    </header>
    <main class="main">
      <slot name="main" />
    </main>
    <footer flex flex-col items-center op-50 class="footer">
      <slot name="footer" />
    </footer>

    <template #shrinkHeader>
      个人中心
    </template>
  </WithHeadPage>
</template>

<style lang="scss" scoped>
.PersonalLayout {
  .header {
    .statusbar & {
      height: 130px;
    }
    position: relative;

    width: 100%;
    height: 106px;

    flex-shrink: 0;
  }
  z-index: 1;
  position: relative;

  width: 100%;
  height: 100%;

  overflow-x: hidden;
  overflow-y: auto;

  background-color: var(--el-fill-color);
}

.PersonalLayout {
  display: flex;

  height: 100%;

  flex-direction: column;

  .main {
    padding: 1rem;

    flex: 1;
  }

  .footer {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
