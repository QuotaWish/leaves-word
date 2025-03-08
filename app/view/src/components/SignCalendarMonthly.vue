<script setup lang="ts">
import { Calendar } from 'vant'
import { calendarManager } from '~/modules/words/core/word'
import LeafCard from './display/LeafCard.vue'

// function calcAccumuData(signData: string): number {
//   let num = (signData) || ''
//   let amo = 0

//   while (num.length) {
//     if (((+num.at(-1)! || 0) & 1) === 0)
//       break

//     num = num.slice(0, -1)
//     amo++
//   }

//   return amo
// }

const date = new Date()
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

const todayData = calendarManager.getTodayData()
// const todaySigned = computed(() => todayData?.signed)
const signedDays = computed(() => (todayData?.origin.day || ''))
const signedDayMap = computed(() => signedDays.value.split(''))
</script>

<template>
  <LeafCard class="SignCalendarMonthly">
    <Calendar
      :show-confirm="false" :show-mark="false" :show-title="false" :poppable="false" :min-date="firstDay"
      :max-date="lastDay"
    >
      <template #text="{ text }">
        <span :class="{ active: signedDayMap[text] === '1' ? '-' : '' }" class="sign-day">
          <span>{{ text }}</span>

        </span>
      </template>
    </Calendar>
  </LeafCard>
</template>

<style lang="scss">
.SignCalendarMonthly {
  .sign-day {
    display: flex;

    align-items: center;
    justify-content: center;

    color: var(--el-text-color-primary);
    width: var(--van-calendar-selected-day-size);
    height: var(--van-calendar-selected-day-size);

    border-radius: 12px;
    &.active {
      font-weight: 600;
      font-size: 18px;
      background-color: var(--theme-color); // var(--el-color-success);
    }
  }

  .van-calendar {
    border-radius: 10px;
  }
  padding: 0 !important;

  // background-color: var(--el-fill-color);
  // border: 1px solid var(--el-border-color);

  --van-calendar-day-height: 48px;
  --van-calendar-selected-day-size: 32px;
  --van-calendar-selected-day-background: #0000;
  --van-text-color: var(--el-text-color-regular);
  --van-calendar-background: var(--el-fill-color);
}
</style>
