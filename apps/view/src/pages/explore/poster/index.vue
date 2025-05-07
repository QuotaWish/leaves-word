<script setup lang="ts">
import NumberFlow from "@number-flow/vue";

const route = useRoute("/explore/poster/");

const path = computed(() => route.query.path as string);
const title = computed(() => (route.query.title as string) ?? "ExplorePoster");

const times = useLocalStorage("poster-countdown", {
  hour: 23,
  minute: 59,
  second: 59,
  lastTime: -1,
});

useIntervalFn(() => {
  times.value.second--;
  if (times.value.second < 0) {
    times.value.second = 59;
    times.value.minute--;
  }

  if (times.value.minute < 0) {
    times.value.minute = 59;
    times.value.hour--;
  }

  if (times.value.hour < 0) {
    times.value.hour = 0;
    times.value.minute = 0;
    times.value.second = 0;
  }

  if (times.value.hour === 0 && times.value.minute === 0 && times.value.second === 0) {
    times.value.lastTime = new Date().getTime();
    times.value.hour = 23;
    times.value.minute = 59;
    times.value.second = 59;
  }
});

onMounted(() => {
  const now = new Date();
  const lastTime = times.value.lastTime;

  if (now.getTime() - lastTime > 1000 * 60 * 60 * 24) {
    times.value.hour = 23;
    times.value.minute = 59;
    times.value.second = 59;

    times.value.lastTime = now.getTime(); // 24 hours
  }
});
</script>

<template>
  <PageNavHolder
    :title="title"
    :content-padding="false"
    class="ExplorePoster h-full w-full"
  >
    <div class="ExplorePoster-Container flex flex-col h-full w-full">
      <div class="ExplorePoster-Main">
        <img :title="title" :src="path" />
        <img :title="title" :src="path" />
      </div>

      <div class="ExplorePoster-Fab items-center flex flex-col fake-background">
        <div class="ExplorePoster-Fab-Icon">
          <img src="/rob.webp" />
        </div>
        <div class="font-bold color-[#F12424FF]">
          <span>限时秒杀</span>
        </div>
        <div class="color-[#FF523F] font-bold">
          <NumberFlow
            :prefix="times.hour < 10 ? '0' : ''"
            :continuous="true"
            :will-change="true"
            :animated="true"
            :value="times.hour"
          />
          :
          <NumberFlow
            :prefix="times.minute < 10 ? '0' : ''"
            :continuous="true"
            :will-change="true"
            :animated="true"
            :value="times.minute"
          />
          :
          <NumberFlow
            :prefix="times.second < 10 ? '0' : ''"
            :continuous="true"
            :will-change="true"
            :animated="true"
            :value="times.second"
          />
        </div>
      </div>

      <div class="ExplorePoster-Action gap-2 flex-col fake-background">
        <LeafSpeedButton w-full>
          <span>
            <span text-lg class="color-[#DF3838FF]" font-bold>￥0.99</span>
            立即报名
          </span>
        </LeafSpeedButton>
        <p mx-2 op-50 text-sm>*未达到课程效果，报名费全额退。</p>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.ExplorePoster-Fab {
  &-Icon {
    position: absolute;

    font-size: 25px;
    color: red;

    width: 64px;
    height: 64px;

    top: 50%;
    right: -1rem;

    transform: translate(-50%, -50%);
  }
  z-index: 100;
  position: absolute;
  padding: 0.5rem 1rem;
  padding-right: 5rem;

  right: 0;
  bottom: 20%;

  --fake-color: #f12424ff;
  --fake-opacity: 0.125;
  border-radius: 1rem 0 0 1rem;
  backdrop-filter: blur(18px) saturate(180%);
  box-shadow: 0 0 1rem 0 rgba(200, 50, 100, 0.25);
}

.ExplorePoster {
  min-height: 100%;

  &-Main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-Action {
    position: sticky;
    display: flex;
    padding: 1rem 1.5rem;
    margin-top: auto;

    bottom: 0;

    justify-content: center;

    --fake-opacity: 0.75;
    backdrop-filter: blur(18px) saturate(180%);
  }
}
</style>
