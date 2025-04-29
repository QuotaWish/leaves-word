<script setup lang="ts">
import Entertainment from '~/modules/entertainment/index.vue'
</script>

<template>
  <WithHeadPage :adapt="false" class="EntertainmentPage">
    <div class="EntertainmentPage-Main">
      <Entertainment />
    </div>

    <template #shrinkHeader>
      休闲娱乐
    </template>
  </WithHeadPage>
</template>

<style lang="scss">
.EntertainmentPage {
  display: flex;
  flex-direction: column;

  .EntertainmentPage-Main {
    padding-top: 44px;
  }
}
</style>
