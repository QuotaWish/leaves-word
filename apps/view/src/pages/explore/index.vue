<script setup lang="ts">
import { Swipe, SwipeItem } from 'vant'
import Explore from '~/modules/explore/index.vue'
import { useRouter } from "vue-router"

defineOptions({
  name: 'ExplorePage',
  meta: {
    transition: 'nav',
  },
})

const icons = [{
  name: '综合提升',
  icon: 'i-carbon:arrow-up',
  path: '/explore/comprehensive',
  color: ['#02D9B2', '#01BDB4'],
}, {
  name: '发音',
  icon: 'i-carbon:activity',
  path: '/explore/pronounce',
  color: ['#B392F2', '#8A69F6'],
}, {
  name: '口语',
  icon: 'i-carbon-headphones',
  path: '/explore/speech',
  color: ['#20DF9F', '#13D77F'],
}, {
  name: '听力',
  icon: 'i-carbon-music',
  path: '/explore/listen',
  color: ['#FFA9E8', '#FD82D0'],
}, {
  name: '配音',
  icon: 'i-carbon-media-library-filled',
  path: '/explore/dub',
  color: ['#FEAA06', '#FF7C01'],
}, {
  name: '短视频',
  icon: 'i-carbon-video',
  color: ['#FE4794', '#FF4B50'],
}, {
  name: '四六级',
  icon: 'i-carbon-enumeration-usage',
  color: ['#0DB2B3', '#0B7B8A'],
}, {
  name: '红色旋风',
  icon: 'i-carbon-tropical-storm-tracks',
  color: ['#FE0000', '#F30102'],
}, {
  name: '休闲娱乐',
  icon: 'i-carbon-face-cool',
  color: ['#0FDEFE', '#00B4FE'],
}, {
  name: '词汇测试',
  icon: 'i-carbon-request-quote',
  color: ['#FBDC03', '#FEB601'],
}]

const router = useRouter()

function directPage(icon: any) {
  if (icon.path)
    router.push(icon.path)
}
const swiperList: Array<string> = [
  "https://img2.quotawish.com/2025/03/04/67c71582b0b5e.gif",
  "https://img2.quotawish.com/2025/03/04/67c7158472ce5.gif",
  "https://img2.quotawish.com/2025/03/04/67c71586dd466.gif",
  "https://img2.quotawish.com/2025/03/04/67c715860048c.gif",
  "https://img2.quotawish.com/2025/03/04/67c7158c240f3.gif",
];
</script>

<template>
  <Explore>
    <div class="ExplorePage-Icon">
      <div v-for="icon in icons" :key="icon.name" class="ExplorePage-IconItem"
        :style="`--c1: ${icon.color[0]}; --c2: ${icon.color[1]}`" @click="directPage(icon)">
        <div class="ExplorePage-IconItem-Bg">
          <div :class="icon.icon" />
        </div>
        <span>{{ icon.name }}</span>
      </div>
    </div>

    <div my-2 class="ExplorePage-Banner">
      <Swipe>
        <!-- <SwipeItem v-for="item in 1" :key="item">
          <h3 class="ExplorePage-BannerItem small justify-center" text="2xl">
            千叶单词 | 立即体验
          </h3>
        </SwipeItem> -->
        <SwipeItem>
          <h3 class="ExplorePage-BannerItem small justify-center" text="2xl">
            你离地道发音还有多远？
          </h3>
        </SwipeItem>
        <SwipeItem v-for="(item, idx) in swiperList" :key="idx">
          <img :src="item" style="width: 100%; height: 100%; object-fit: cover" />
        </SwipeItem>
      </Swipe>
    </div>

    <div class="ExplorePage-Course">
      <h1>更多课程</h1>

      <WordIndexBanner />
    </div>
  </Explore>
</template>

<style lang="scss">
.ExplorePage-BannerItem {
  position: relative;
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: #fff;
  border-radius: 25px;
  background-image: linear-gradient(to right, rgb(248, 99, 99), rgb(74, 74, 231));
}

.ExplorePage-Banner .van-swipe {
  height: 120px;
}

.ExplorePage-Course {
  h1 {
    margin-bottom: 1rem;

    font-size: 22px;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }
}

.ExplorePage-Icon {
  &Item {
    display: flex;

    gap: 0.5rem;
    align-items: center;
    flex-direction: column;

    &-Bg {
      display: flex;

      align-items: center;
      justify-content: center;

      width: 48px;
      height: 48px;

      color: #fff;
      font-size: 20px;
      font-weight: 600;
      border-radius: 50%;
      background-image: linear-gradient(to bottom, var(--c1), var(--c2));
    }

    span {
      font-size: 14px;

      color: var(--el-text-color-regular);
    }
  }

  margin: 1rem 0;
  display: grid;

  width: 100%;

  gap: 0.5rem;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
</style>

<route lang="yaml">
meta:
  transition: nav
</route>
