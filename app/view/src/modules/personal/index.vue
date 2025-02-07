<script setup>
import VersionBar from '~/components/chore/VersionBar.vue'
import { calendarManager } from '~/composables/words'
import PersonalHeaderDisplay from './PersonalHeaderDisplay.vue'
import PersonalLayout from './PersonalLayout.vue'

const router = useRouter()

async function handleClear() {
  calendarManager.clear()

  await useRequestAnimationFrame()

  // eslint-disable-next-line no-alert
  alert('已清除打卡数据')
}
</script>

<template>
  <PersonalLayout>
    <template #header>
      <PersonalHeaderDisplay>
        <div h-full w-full flex flex-col>
          <div w-full flex justify-end class="header-line h-[32px]">
            <div i-ri:bubble-chart-fill />
          </div>
          <div flex items-center gap-4 class="header-main">
            <div class="header-img">
              <img src="/avatar.jpg">
            </div>
            <div flex flex-col justify-center class="header-content">
              <p font-size-5 font-bold class="name">
                Test Account
              </p>
              <p class="indent-[2px]" font-size-4 op-60>
                Leave words, Embrace worlds!
              </p>
            </div>
          </div>
        </div>
      </PersonalHeaderDisplay>
    </template>
    <template #main>
      <SignCalendar my-1 />
      <SignCalendarMonthly my-4 />

      <!-- <LineArrow>
        <template #icon>
          <div i-carbon:calendar />
        </template>
我的日历
</LineArrow> -->
      <div flex flex-col gap-3>
        <LineArrow @click="router.push('/personal/settings')">
          <template #icon>
            <div i-carbon:paint-brush />
          </template>
          个性化设置
        </LineArrow>
        <LineArrow @click="handleClear">
          <template #icon>
            <div i-carbon:help />
          </template>
          帮助与反馈
        </LineArrow>
      </div>
    </template>

    <template #footer>
      <p>
        <VersionBar />
      </p>
      <p font-size-3>
        Powered by QuotaWish.
      </p>
    </template>
  </PersonalLayout>
</template>

<style lang="scss">
.header-img {
  img {
    width: 48px;
    height: 48px;

    border-radius: 50%;
  }
  display: flex;

  width: 52px;
  height: 52px;

  align-items: center;
  justify-content: center;

  border-radius: 50%;
  box-shadow: var(--el-box-shadow);
  background-color: var(--el-text-color-primary);
}
</style>
