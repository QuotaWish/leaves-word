<script setup lang="ts">
import CardCarousel from './components/CardCarousel.vue'
import GameCards from './components/GameCards.vue'

const router = useRouter()
</script>

<template>
  <div class="Entertainment py-2 flex flex-col items-center h-full overflow-y-auto">
    <div @click="router.push('/explore')" class="Entertaiment-Back cursor-pointer self-start ml-4 font-bold w-[44px] h-[44px] flex items-center justify-center rounded-full fake-background">
      <div i-carbon-chevron-left />
    </div>

    <CardCarousel />
    <GameCards />
  </div>
</template>
