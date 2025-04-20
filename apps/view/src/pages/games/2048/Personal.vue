<script setup lang="ts">
import { purchases, format, computedTasks, genTasks } from './data';
const props = defineProps<{
  options: any,
}>()

const { totalScores, average, total, level }: any = inject('userData')!
watchEffect(() => {
  genTasks({ totalScores, average, total, ...props.options })
})
</script>

<template>
  <div>
    <div class="player-info-card">
      <div class="info">
        <h2>个人游戏信息</h2>
        <div class="stats">
          <div class="stat">
            <div class="label">累计得分:</div>
            <div class="value">{{ totalScores }}分</div>
          </div>
          <div class="stat">
            <div class="label">平均得分:</div>
            <div class="value">{{ average }}分</div>
          </div>
          <div class="stat">
            <div class="label">游戏场次:</div>
            <div class="value">{{ options.game_count }}场</div>
          </div>
        </div>
        <div v-if="level?.length === 3" class="level">
          <span style="width: 150px">等级{{ level[0] }}</span>
          <span class="level-progress" :style="`--p: ${level[2]}%`">
            <span class="color">{{ level[2] }}%</span>
          </span>
          <span>{{ format(totalScores) }}/{{ format(level[1]) }}</span>
        </div>
      </div>
    </div>

    <div class="player-info-card">
      <div class="purchases">
        <h3>道具商店</h3>
        <span>积分：{{ String(options?.cumulative_score || 0).replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') }}</span>
      </div>
      <ul>
        <li v-for="(purchase, index) in purchases" :key="index">{{ purchase }}</li>
      </ul>
    </div>

    <div class="player-info-card">
      <div class="purchases">
        <h3>完成成就</h3>
        <span>统计： {{ computedTasks.filter(item => item.per >= 100).length }}/{{ computedTasks.length }} 个</span>
      </div>
      <ul>
        <li :class="{ active: purchase.per >= 100 }" :style="`--p: ${purchase.per}%`"
          v-for="(purchase, index) in computedTasks" :key="index">{{ purchase.text }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.player-info-card li::before {
  content: "";
  position: absolute;

  height: 100%;
  width: var(--p);

  left: 0;
  top: 0;

  border-radius: .25rem;
  background-color: #16161610;
}

.player-info-card li.active::before {
  background-color: #205b7e10;
}

.player-info-card li.active {
  color: green !important;
  font-weight: 600;
  background-color: #205b7e10;
}

.player-info-card li {
  position: relative;
}

.level {
  margin-top: .75rem;

  display: flex;

  gap: .25rem;
  align-items: center;
  justify-content: space-between;
}

.level span.level-progress {
  position: relative;
  margin: 0 .25rem;

  height: 20px;
  line-height: 20px;
  width: 100%;

  border-radius: .25rem;
  background-color: #e6e6e6E0;
}

span.level-progress .color {
  color: #000;

  text-shadow: 0 0 4px #fff;
  /* mix-blend-mode: difference; */
}

.level span.level-progress::before {
  content: "";
  position: absolute;

  height: 100%;
  width: var(--p);

  left: 0;
  top: 0;

  border-radius: .25rem;
  background-color: #16161610;
}

.purchases {
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;

  /* gap: 1rem;
  display: flex;
  justify-content: center; */
}

.purchases h3 {
  text-align: center;
  font-weight: 600;
}

.purchases span {
  display: inline-block;
  padding: 0 1rem;

  width: 100%;
  text-align: right;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.player-info-card {
  width: 100%;
  margin: 0 auto 1rem;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info {
  text-align: center;
  font-weight: 600;
}

.stats {
  display: flex;

  gap: .5rem;
  justify-content: space-around;
  margin-top: 20px;

  font-weight: 300;
}

.stat {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.label {
  font-weight: bold;
}

.value {
  margin-top: 5px;
}
</style>
