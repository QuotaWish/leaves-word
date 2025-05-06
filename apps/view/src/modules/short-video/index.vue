<script setup lang="ts">
import { VIDEOS } from './video-resource'
import VideoPlayer from './components/VideoPlayer.vue'
import DraggableCard from './components/dragger/DraggableCard.vue'

let amo = 0

function loadMoreVideos() {
  if (amo >= 3) {
    return
  }

  amo += 1

  const result = []
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * VIDEOS.length)
    result.push({
      ...VIDEOS[randomIndex],
      id: `${i}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // 添加唯一ID
    })
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(result)
    }, Math.random() * 2000)
  })
}

function handlePullupRefresh() {
  amo = 0
  return loadMoreVideos()
}

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <RoutePage :adapt="false" class="ShortVideoHolder h-full w-full">
    <div
      flex
      items-center
      @click="goBack"
      class="ShortVideoHolder-Nav"
    >
      <div class="nav-left">
        <i block i-carbon-chevron-left></i>
      </div>
      <div class="nav-title">退出</div>
    </div>

    <DraggableCard
      @pull-up-refresh="handlePullupRefresh"
      @load-more="loadMoreVideos"
    >
      <template #default="{ item, isCurrent }">
        <VideoPlayer :isCurrent="isCurrent" :item="item" />
      </template>
    </DraggableCard>
  </RoutePage>
</template>

<style lang="scss" scoped>
.ShortVideoHolder {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ShortVideoHolder-Nav {
  position: fixed;
  padding: 8px 12px;
  top: calc(44px + 1rem);
  left: 1rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 24px;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);

  .nav-left {
    color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .nav-title {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    margin-left: 2px;
  }
}
</style>
