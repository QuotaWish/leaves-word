<script setup lang="ts" generic="T extends any, O extends any">
import PlanLayout from './PlanLayout.vue'

const cozeWebSDK = new CozeWebSDK.WebChatClient({
  config: {
    // 智能体 ID
    botId: '7448405006673412115',
  },
  ui: {
    footer: {
      expressionText: 'Powered by {{QuotaWish}}.',
      linkvars: {
        QuotaWish: {
          text: 'QuotaWish 科塔智爱',
          link: 'https://quotawish.com',
        },
      },
    },
    chatBot: {
      title: 'Lucas Tata',
    },
    asstBtn: {
      isNeed: false,
    },
    base: {
      icon: 'https://ai.quotawish.com/favicon.ico',
    },
  },
})
</script>

<template>
  <PlanLayout>
    <template #header>
      <div class="coffee-font" text-1.75xl flex items-center gap-1 font-bold @click="cozeWebSDK.showChatBot()">
        <img w-8 src="/ai-logo.png">
        Tata
      </div>

      <div flex items-center gap-2>
        <RoundInfo type="danger">
          <div i-carbon-favorite-filled />
          5
        </RoundInfo>

        <RoundInfo type="warning">
          <div i-carbon-star-filled />
          400
        </RoundInfo>
      </div>
    </template>

    <template #main>
      <slot name="main" />

      <!-- <DisplayIndexCourse /> -->
    </template>

    <template #cover>
      <slot name="cover" />
    </template>
  </PlanLayout>
</template>

<style lang="scss">

</style>
