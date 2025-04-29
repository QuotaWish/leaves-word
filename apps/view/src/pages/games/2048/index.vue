<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Slider from './slider/index.vue'
import HeadBar from './HeadBar.vue';
import Footer from './footer/Footer.vue';
import Rankings from './rankings/index.vue'
import Block from './Block.vue';
import Settings from './Settings.vue';
import { Game2048, postScore, postScoreNew } from './game'
import BGM from './BGM.mp3'
import { useUserData } from './data';
import { angle } from './orientation'
import { tryAward } from '~/components/award/awards'

defineOptions({
  name: '2048 Game',
})

const _change = ref(0)
const tracks = ref<any>([])
const game = new Game2048()

const gameSettings = game.gameSettings

if (localStorage.getItem("gameSettings")) {
  Object.assign(gameSettings, JSON.parse(localStorage.getItem("gameSettings")!))
}

watch(gameSettings, (newVal) => {
  localStorage.setItem("gameSettings", JSON.stringify(newVal))
})

const options = reactive({
  mute: false,
  error: false,
  recordsMode: false,
  personal: game.personal,
  online: game.onlinePlayers,
  state: game.state,
  game: null,
  menu: "游戏"
})

// @ts-ignore
const user = 'test' // window.$name

function transparencyToggle(val: boolean) {
  // if (historyHighest.value <= 1000) {
  //   alert('很抱歉，您需要达到 3,000 分才可以进行游戏设置！')
  //   return
  // }

  setTimeout(() => options.recordsMode = val, 200)
}

const historyHighest = computed(() => {
  const _user = [...game.rankings.value].filter(res => res.user === user.value)
  if (_user.length !== 1) return options.state.score

  return Math.max(options.state.score, _user[0].score)
})

const canResurrection = ref<boolean>(false)
game.listen((_tracks: any) => {
  tracks.value = _tracks

  const music = document.getElementById('music') as HTMLAudioElement
  if (options.state.status === 'end') {

    canResurrection.value = game.canResurrection()

    // 清空缓存
    localStorage.removeItem('__map');
    localStorage.removeItem('__state');

    music?.pause?.()

    setTimeout(() => game.playFailed(), 200)
  } else if (!options.mute) music?.play?.()

})

setTimeout(() => game.start(user), 200)

function restart(ignoreState: boolean = false) {
  game.start(user, ignoreState)
}

function handleREstart() {

  if (gameSettings.mode === 'rank') {
    if (gameSettings.func.startUp) {
      postScore(user.value, options.state.score)
    } else postScoreNew(user.value, options.state.score)

  }

  restart(true)
}

function change() {
  _change.value += 1

  if (_change.value >= 5) {
    // 弹出确认框
    if (!confirm("切换账号会导致本地数据被清空，是否继续？")) return

    _change.value = 0;

    user.value = ''
    localStorage.setItem('user', '')

    localStorage.removeItem('__map');
    localStorage.removeItem('__state');
    localStorage.removeItem('gameSettings');

    location.reload()
  }
}

// const baseUrl = 'https://124.223.71.129:9981'
const baseUrl = 'https://gameends.tagzxia.com:9981'

function getStatus() {
  // 向 baseUrl/status 发送 get
  // fetch(`${baseUrl}/status`)
  //   .then(res => res.json())
  //   .then(data => {
  //     options.version = data?.version
  //     options.error = !data?.status
  //     options.nonLatest = data?.latest > options.latest
  //   })
  //   .catch(err => {
  //     options.error = true
  //     console.log(err)
  //   })
}


function reconnect() {
  getStatus()
}

getStatus()

// @ts-ignore force exist
watch(() => options.recordsMode || options.error || options.reverse, (val) => window._ignore = val)
// @ts-ignore force exist
watch(() => options.menu, (val) => window._ignore = val !== '游戏')
watch(() => options.recordsMode, val => {
  if (!val) options.menu = '游戏'
})
watch(() => gameSettings.func.startUp, (val) => {
  if (val) {
    document.body.classList.remove(gameSettings.mode)
    gameSettings.mode = 'rank'
    document.body.classList.add(gameSettings.mode)
    restart(true)
  }

  console.log('s', val, gameSettings)
}, { immediate: true })

// 计算 speed 模式背景流速
const _speedBackground = computed(() => {
  function calculateY(x: number) {
    if (x < 10) {
      return 5;
    } else if (x >= 10 && x <= 50) {
      return 5 - (x - 10) * 0.1;
    } else if (x >= 100 && x <= 150) {
      return 3 - (x - 100) * 0.04;
    } else {
      // 对于超出以上范围的情况
      // 计算y值的递减量
      let decrement = (x - 150) * 0.0066667;
      // y最小为0.5
      return Math.max(0.1, 1 - decrement);
    }
  }

  return calculateY(gameSettings.step)
})

const userData = useUserData(options)
provide('userData', userData)

function handleResurrection() {
  // 随着复活次数增加 题目增加
  // 0: 3 / 1: 5 / 2 : 7 / 3: 9
  const cnt = gameSettings.$.resurrection
  const level = Math.max(1, Math.floor(cnt / .5))
  const step = level * 2 + 1

  tryAward('words', "免费复活一次！", {
    cnt: step,
  }).then(res => {
    if (!res) {
      alert('你无法复活！')
    } else {
      alert('点击确定后立即复活！')

      game.state.status = 'start'
      game.resurrection()
    }
  })
}
</script>

<template>
  <div @click="reconnect" @touchstart="reconnect" class="Game" :style="`--s: ${_speedBackground}s`"
    :class="{ rankings: options.menu === '排行', startup: gameSettings.func.startUp, records: options.recordsMode }">
    <div class="Game-end" :class="{ show: options.state.status === 'end' }">
      <p>游戏结束</p>

      <div class="Game-end-button">
        <button @touchstart="handleREstart" @click="handleREstart">重新开始</button>
        <button v-if="canResurrection" @touchstart="handleResurrection" @click="handleResurrection">立即复活</button>
      </div>
    </div>

    <div class="Game-Container">
      <HeadBar :gameSettings="gameSettings" :online="options.online" :historyHighest="historyHighest"
        :rankings="game.rankings" :score="options.state.score" />

      <div class="GameWrapper">
        <div id="GameJust" class="Just">
          <div class="BlockLine" v-for="(col, i) in game.map" :key="i">
            <Block :angle="gameSettings.func.rotate ? angle : 0" v-for="(item, j) in col" :tracks="tracks" :key="j"
              :x="j" :y="i" :val="item" />
          </div>
        </div>
        <div class="Back">
          <Rankings :show="options.menu === '排行'" :options="options" :rankings="game.rankings" />
        </div>
      </div>
    </div>

    <Settings :options="options.personal" v-model:show="options.recordsMode" :data="gameSettings" />

    <div @click="change" @touchstart="change" class="Game-Info">
      欢迎 {{ user }} ！ <span class="version">v{{ options.latest }}/{{ options.version }}</span>
    </div>

    <audio id="music" :src="BGM" autoplay="false" preload="auto"></audio>

    <Slider v-if="!gameSettings.func.startUp" @restart="restart" :gameSettings="gameSettings"
      :time="parseInt(`${gameSettings.time.sec / 10}`)" v-model="gameSettings.mode" />
    <Footer @settings="transparencyToggle" v-model="options.menu" />
  </div>
</template>

<style>
.Game-end-button {
  display: flex;

  gap: 1rem;
}

.Game-Container {
  position: absolute;
  padding: 1rem 0;
  display: flex;

  align-items: center;
  flex-direction: column;
  justify-content: space-around;

  top: 20px;

  width: 100%;
  height: calc(90% - 70px);
}

.GameWrapper {
  position: relative;
  display: flex;

  top: 0;
  left: 0;

  width: 22rem;
  height: 22rem;

  border-radius: 8px;
  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);
  /* transform: translate(-50%, -50%); */

  transition: .25s cubic-bezier(.4, 0, .2, 1);
  transform-style: preserve-3d;
  perspective: 1000px;

  overflow: hidden;
}

.Game.startup .Tools,
.Game.records .Tools {
  opacity: 0;
  transform: scale(0)
}

.Game.records .non-latest {
  transform: translate(-50%, 0) scale(0);
}

@keyframes shinning {

  0%,
  100% {
    opacity: .25;
  }

  50% {
    opacity: 1;
  }
}

.version {
  opacity: .5;
  font-size: 0.8rem;
}

.Game.records .GameWrapper {
  pointer-events: none;
  opacity: 0.5;

  perspective: 1000px;
  transform-style: preserve-3d;
  transform: translate(0, -120%) scale(0) rotate3D(0.5, 0, 0, 320deg);
}

.Tools {
  position: relative;
  display: flex;

  gap: 1rem;
  justify-content: center;
  align-items: center;

  /* left: 50%; */
  /* top: 30%; */

  width: 22rem;
  height: 5%;

  cursor: pointer;
  user-select: none;
  overflow-y: scroll;
  border-radius: 8px;
  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);
  /* transform: translate(-50%, 0); */
  z-index: 100;

  overflow: hidden;
  transition: .25s;
}

.GameWrapper .Back,
.GameWrapper .Just {
  position: absolute;

  left: 0;
  top: 0;

  width: 100%;
  height: 100%;

  backface-visibility: hidden;
}

.Game-Info {
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, .5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  backdrop-filter: blur(18px) saturate(180%);
}

.Game-end {
  z-index: 1001;
  position: absolute;
  display: flex;

  flex-direction: column;

  gap: 1rem;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  opacity: 0;
  pointer-events: none;
  transform: scale(1.2);
  transition: .25s;

  background-color: #00000050;

}

.Game-end.show {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

.Game-end button {
  padding: .5rem;

  cursor: pointer;
  border-radius: 8px;
  background-color: #ffffff80;
}

.Game-end p {
  font-size: 1.5rem;
  font-weight: 600;

  color: #ffffffA0;
}

.Game {
  position: absolute;

  width: 100%;
  height: 100%;

  background-size: cover;
  background-image: linear-gradient(120deg, #e0c3fcE0 0%, #8ec5fcE0 100%);
  /* background-image: url("./bg.png"); */

  overflow: hidden;

  animation: hue 30s infinite linear;
}

body.speed .Game {
  background-size: 100% 200%;

  animation: speedUp var(--s) infinite linear;
}

@keyframes speedUp {
  from {
    filter: hue-rotate(0deg);
    background-position: 0 0;
  }

  to {
    filter: hue-rotate(360deg);
    background-position: 0 200%;
  }
}

@keyframes hue {
  from {
    filter: hue-rotate(0deg);
  }

  to {
    filter: hue-rotate(360deg);
  }
}
</style>

<route lang="yaml">
meta:
  layout: game
</route>
