<script setup lang="ts">
import { VIDEOS } from './video-resource'
import DraggableCard from './components/dragger/DraggableCard.vue'
import VideoPlayer from './components/VideoPlayer.vue'

let amo = 0
const loadMoreVideos = async () => {
  if ( amo >= 3 ) return

  amo += 1

  const result = []
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * VIDEOS.length)
    result.push({
      ...VIDEOS[randomIndex],
      id: `${i}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` // 添加唯一ID
    })
  }

  await sleep(Math.random() * 5000)

  return result
}

const handlePullupRefresh = async () => {
  amo = 0

  return loadMoreVideos()
}

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <RoutePage :adapt="false" class="ShortVideoHolder h-full w-full">
    <div flex items-center @click="goBack" class="ShortVideoHolder-Nav">
      <div class="nav-left">
        <i block i-carbon-chevron-left></i>
      </div>
      <div class="nav-title">退出</div>
    </div>

    <DraggableCard @pull-up-refresh="handlePullupRefresh"  @load-more="loadMoreVideos">
      <!-- 使用正确的插槽名称和参数 -->
      <template #default="{ item }">
        <VideoPlayer :item="item">

        </VideoPlayer>
      </template>
    </DraggableCard>

    <!-- 当接近视频列表末尾时加载更多 -->
    <!-- <div v-if="currentIndex >= videoList.length - 3" style="display: none;" @load="loadMoreVideos()"></div> -->
  </RoutePage>
</template>

<style lang="scss" scoped>
.ShortVideoHolder {}

.ShortVideoHolder-Nav {
  position: fixed;
  padding: 0.5rem 0.5rem;
  top: 1rem;
  left: 1rem;
  right: 0;
  display: flex;
  align-items: center;
  z-index: 100;

  width: max-content;

  font-size: 12px;
  border-radius: 16px;
  filter: drop-shadow(var(--el-text-color-primary) 0 0 10px);
  background-color: var(--el-overlay-color-lighter);

  .statusbar & {
    height: 80px;
  }

  .fullscreen & {
    top: 74px;
  }
}

.nav-left {
  color: var(--el-bg-color);
  font-size: 16px;
  cursor: pointer;

  filter: drop-shadow(var(--el-text-color-primary) 0 0 10px);
}

.nav-title {
  color: var(--el-bg-color);
  font-weight: 500;
}
</style>
