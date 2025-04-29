<script setup lang="ts">
import GameSingleCard from './GameSingleCard.vue'
import Pattern2048 from './game/Pattern2048.vue';
import PatternWay from './game/PatternWay.vue';
import PatternCat from './game/PatternCat.vue';
import PatternBat from './game/PatternBat.vue';
import PatternDice from './game/PatternDice.vue';
import PatternTang from './game/PatternTang.vue';

const props = defineProps<{
  modelValue?: boolean,
}>()

const router = useRouter()

const games = [
  {
    name: '2048',
    desc: "全新升级，多模式来袭！",
    click: () => {
      router.push(`/games/2048`)
    },
    comp: Pattern2048
  },
  {
    name: '闲了个闲',
    desc: "你的智商还不够玩...",
    comp: PatternTang,
    click: () => {
      router.push('/games/tang')
    }
  },
  {
    name: '拼图华容道',
    desc: "正在努力开发中...",
    disabled: true,
    comp: PatternWay
  },
  {
    name: '捕捉猫猫',
    desc: "正在努力开发中...",
    disabled: true,
    comp: PatternCat
  },
  {
    name: '捕捉蝙蝠',
    desc: "正在努力开发中...",
    disabled: true,
    comp: PatternBat
  },
  {
    name: '智慧骰子',
    desc: "来试试真心话大冒险吧...",
    disabled: true,
    comp: PatternDice
  },
]
</script>

<template>
  <div class="GameCards">
    <GameSingleCard @go="item.click" :disabled="item.disabled" v-for="item in games" :desc="item.desc"
      :name="item.name">
      <component :is="item.comp" />
    </GameSingleCard>
  </div>
</template>

<style>
.GameCards {
  position: relative;
  padding: .5rem;
  display: flex;

  flex: 1;
  flex-wrap: wrap;
  width: 100%;

  gap: .5rem;
  /* flex-direction: column; */
  align-items: center;
  justify-content: space-around;

  /* overflow-y: scroll; */
}
</style>
