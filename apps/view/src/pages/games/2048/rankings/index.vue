<script setup lang="ts">
import RankPerson from './RankPerson.vue';

const props = defineProps<{
  show: boolean,
  rankings: any,
  options: any
}>()

const menu = ref(0)

function getTime(time: any) {
  // 将时间转换为 xx:xx:xx
  const date = new Date(time * 1000)
  return date.toUTCString()
}

// @ts-ignore
const user = window.$name
</script>

<template>
  <div class="Rank-Container" :class="{ show }">
    <div class="BackFace">
      <div class="Menu">
        <span @touchstart.prevent="menu = 0" @click="menu = 0" :class="{ select: menu === 0 }">排行</span>
        <span @touchstart.prevent="menu = 1" @click="menu = 1" :class="{ select: menu === 1 }">战绩</span>
      </div>
      <div class="Main">
        <div :class="{ select: menu === 0 }" class="Rankings">
          <RankPerson :self="user === item.user" :online="options.online.indexOf(item.user) !== -1" :data="item"
            :index="index" v-for="(item, index) in rankings.value">

          </RankPerson>
          <!-- <span class="Rank" :class="`Rank-${index + 1}`" v-for="(item, index) in rankings.value">
            {{ index + 1 }}. {{ item.user }}<span class="online-status"
              v-if="options.online.indexOf(item.user) !== -1">在线</span>: {{ item.score
            }}分

            <span class="Float">
              <span v-if="index === 0">大师之首</span>
              <span v-else-if="index === 1">一代宗师</span>
              <span v-else-if="index === 2">承蒙厚爱</span>
              <span v-else>手下败将</span>
            </span>
          </span> -->
        </div>
        <div v-if="options?.personal?.history?.length" :class="{ select: menu === 1 }" class="Awards">
          <div class="Award" v-for="(item, index) in [...options.personal.history].reverse()">
            {{ index + 1 }}. {{ item.score }} 分
            <span class="time">{{ getTime(item.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.Rank-Container {
  position: absolute;

  left: 0;
  top: 0;

  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: white;

  opacity: 0;
  transition: .125s;
  /* transform: scale(0); */

  background-color: #ffffff00;
}

.Rank-Container.show {

  opacity: 1;
  /* transform: scale(1); */
  background-color: #e6e6e680;
}

.Game.rankings .GameWrapper .Just {
  opacity: 0;
}

.Game.rankings .GameWrapper {
  /* width: 100%; */
  height: 100%;

  /* transform: translateY(-10%) rotateY(180deg); */
}

.Game.rankings .HeadBar {
  opacity: 0;
}

/* .Game.rankings .GameWrapper .Back {
  transform: rotateY(180deg);

  backface-visibility: visible;
} */

/* .Game.rankings .GameWrapper .Just {
  backface-visibility: hidden;
} */

div.Awards .Award {
  padding: .25rem .5rem;
  display: flex;

  align-items: center;
  justify-content: space-between;

  font-size: 1rem;
  border-radius: 8px;
  background-color: #eeeeee50;
  backdrop-filter: blur(8px);
}

div.Awards .Award .time {
  margin-left: auto;
  opacity: .5;
  font-size: .75rem;
}

/* div span.online-status {
  opacity: .5;
  font-size: .75rem;
} */

/* div.Rankings span.Float {
  position: absolute;

  right: 0;

  opacity: .5;
} */

/* div.Rankings span {
  color: inherit;
} */

/* div.Rankings span.Rank-1 {
  color: red;
  background-color: #000;

  font-weight: 600;
}

div.Rankings span.Rank-2 {
  color: yellow;
  background-color: #262626;

  font-weight: 600;
}

div.Rankings span.Rank-3 {
  color: orange;
  background-color: #464646;
}

div span.Rank {
  color: #696969;
  background-color: #F6f6f6;
} */

.Main {
  position: relative;

  flex: 1;

  overflow: hidden;
}

.Menu span {
  /* flex: 1; */

  width: 30%;
  text-align: center;

  cursor: pointer;
  transition: .25s;
  border-radius: 4px;
  background-color: #c6c6c680;
}

.Menu span.select {
  flex: 1;

  color: #ffffffEA;
  background-color: #289be780;
}

.Menu {
  display: flex;

  gap: .5rem;
  justify-content: space-around;

  color: #000;

  width: 100%;
}

.BackFace {
  display: flex;
  flex-direction: column;

  gap: .5rem;

  padding: .5rem;

  width: 100%;
  height: 100%;

  backdrop-filter: blur(18px) saturate(180%);
}

/* .Rankings span {
  padding: 0 .25rem;
  color: #000000EA;

  font-size: 1.2rem;
  border-radius: 4px;
} */

.Awards {
  position: absolute;
  padding: 0 .25rem;
  display: flex;

  flex-direction: column;
  justify-content: flex-start;
  /* align-items: center; */

  top: 0;
  left: 0%;

  width: 100%;
  height: 100%;

  color: #000000EA;
  transition: .25s;
  overflow-y: scroll;
  transform: scale(.8) translateX(200%);
}

.Awards.select {
  transform: scale(1) translateX(0);
}

.Rankings {
  position: absolute;
  padding: .25rem .5rem;
  /* display: flex; */

  /* flex-direction: column; */
  /* justify-content: flex-start; */
  /* align-items: center; */

  top: 0;
  left: 0%;

  width: 100%;
  height: 100%;

  gap: .25rem;
  transition: .25s;
  overflow-y: scroll;
  transform: scale(.8) translateX(-200%);
}

.Rankings.select {
  transform: scale(1) translateX(0);
}
</style>
