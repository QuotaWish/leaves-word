<script setup lang="ts">
const props = defineProps<{
  data: any,
  index: number,
  online: boolean,
  self: boolean
}>()

const expand = ref(false)
const _score = computed(() => {
  return props.data.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

const cnt = ref(0)

function handleClick() {
  if (cnt.value <= 3) return cnt.value += 1;

  cnt.value = 0;
  expand.value = !expand.value
}
</script>

<template>
  <div @click="handleClick" :class="{ expand, top: index < 3, online }" class="RankPerson">
    <div class="RankPerson-Head">
      <p class="user">
        {{ data.user }}
        <span style="font-size: 12px" v-if="online">(在线)</span>
      </p>
      <span class="score">{{ _score }}分</span>
      <div class="rank">#{{ index + 1 }}</div>
    </div>

    <div class="RankPerson-Action">
      <span v-if="!self"> 你无法查看对方的统计数据！</span>
      <span v-else>个人资料展示在您达到15级解锁！</span>
    </div>
  </div>
</template>

<style scoped>
.RankPerson-Action {
  position: absolute;

  bottom: .75rem;
  font-size: 14px;

  opacity: 0;
  transition: .25s;
}

div.RankPerson.expand .RankPerson-Action {
  opacity: .5;
}

.rank {
  position: absolute;

  right: 30%;
  top: 50%;
  transform: translateY(-50%) skewX(-16deg);

  font-size: 50px;
  font-weight: bold;

  color: #00000020;
}

div.RankPerson.expand {
  height: 100px;

  background-color: #E6666680;
  animation: cubic-bezier(0.645, 0.045, 0.355, 1) shine 5s infinite;
}

div.RankPerson.expand .rank {
  color: #0768AA;
}

@keyframes shine {
  from {
    filter: hue-rotate(0);
  }

  to {
    filter: hue-rotate(360deg);
  }
}

.score {
  position: relative;

  font-size: 18px;

  color: #FFFFFF;
}

.user {
  position: relative;

  font-size: 20px;
  font-weight: bold;

  color: #FFFFFF;
}

.desc {
  position: relative;

  font-size: 15px;

  color: #FFFFFF;
}

.RankPerson-Head {
  display: flex;

  height: calc(50px - 1rem);

  align-items: center;
  justify-content: space-between;
}

.RankPerson {
  position: relative;
  margin: .5rem 0;
  padding: .5rem;

  height: 50px;
  border-radius: 10px;

  transition: .25s;
  box-sizing: border-box;
  background-color: #08080810;
  box-shadow: 0 0 10px #00000030;
}

.RankPerson.top {
  background-color: #E6666650;
}
</style>
