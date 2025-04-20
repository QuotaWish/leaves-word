<script setup lang="ts">
const props = defineProps<{
  rankings: any,
  historyHighest: number,
  score: number,
  online: any,
  gameSettings: any
}>()

// @ts-ignore
const user = window.$name

const topIndex = computed(() => {
  const _ind = [...props.rankings.value].findIndex(res => res.user === user.value)

  return _ind + 1 || 999
})

const broadcastIndex = ref(0)
const broadcasts = ref([
  () => `当前有 ${props.online.length || 1} 个玩家正在游戏...`,
  () => `全新交换模式，单局 15,000 分自动解锁`, ,
  () => `4.14 12:00 前第一名可领取奖励`,
  () => `交换模式 5s 内只会触发一次`,
  () => `测试版娱乐竞速模式不会统计您的排名`,
])

const broadcast = computed(() =>
  broadcasts.value[broadcastIndex.value]?.()
)

let end: boolean = false
onMounted(() => {
  function _b() {
    if (end) return
    broadcastIndex.value = (broadcastIndex.value + 1) % broadcasts.value.length

    setTimeout(_b, 5000)
  }

  _b()
})

onBeforeUnmount(() => end = true)
</script>

<template>
  <div class="HeadBar">
    <div v-if="gameSettings" class="Game-Bar">
      <div class="Game-Bar-Title">2048
      </div>
      <div class="Game-Bar-Line">
        游戏排行
        <span class="game-score">{{ topIndex || 0 }}</span>
      </div>
      <div class="Game-Bar-Line">
        <template v-if="gameSettings.mode === 'rank'"">
          历史最高
        <span class=" game-score">{{ historyHighest }}</span>
        </template>
        <template v-else-if="gameSettings.mode === 'speed'"">
          滑动次数
          <span class=" game-score">{{ gameSettings.step }}</span>
        </template>
      </div>
      <div class="Game-Bar-Line">
        当前得分
        <span class="game-score">{{ score }}</span>
      </div>
    </div>
    <div class="Game-SubBar">
      {{ broadcast }}
      <!-- 当前有 {{ online.length || 1 }} 个玩家正在游戏... -->
    </div>
  </div>
</template>

<style>
.Game-Bar-Title {
  font-size: 2rem;
  font-weight: 600;

  color: #fff;
  text-shadow: 0 0 8px #000;
}

.game-score {
  width: 4rem;

  text-align: center;

  color: #9A6E5B;
  background: #FCF5E9A0;
  border-radius: 8px;
}

.Game-Bar-Line {
  display: flex;
  padding: .5rem;

  gap: .5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #fff;
  border-radius: 12px;
  background: #C4876A80;
  backdrop-filter: blur(18px) saturate(180%);
}

.Game-SubBar {
  position: relative;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  /* left: 50%; */
  top: 1rem;

  width: 24rem;
  height: 2rem;

  opacity: .5;
  border-radius: 8px;
  /* background-color: #e6e6e6; */
  /* transform: translate(-50%, -50%); */
  z-index: 100;

  transition: .25s;

  overflow: hidden;
}

.Game-Bar {
  position: relative;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* left: 50%; */
  top: 0;

  width: 24rem;
  height: 4rem;

  border-radius: 8px;
  /* background-color: #e6e6e6; */
  /* transform: translate(-50%, 0); */
  z-index: 100;

  transition: .25s;

  overflow: hidden;
}

.Game.records .Game-Bar,
.Game.records .Game-SubBar {
  opacity: 0;
}
</style>
