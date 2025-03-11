<script setup lang="ts">
import { VIDEOS } from './video-resource'
import DraggableCard from './components/dragger/DraggableCard.vue'

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

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <RoutePage :adapt="false" class="ShortVideoHolder h-full w-full">
    <div flex items-center gap-2 @click="goBack" class="ShortVideoHolder-Nav">
      <div class="nav-left">
        <i block i-carbon-chevron-left></i>
      </div>
      <div class="nav-title">退出短视频</div>
    </div>

    <DraggableCard  @load-more="loadMoreVideos">
      <!-- 使用正确的插槽名称和参数 -->
      <template #default="{ item }">
        <div class="video-card" w-full h-full relative>
          <video
            class="video-content"
            w-full h-full object-cover
            :src="item?.url"
            autoplay
            loop
            muted
            webkit-playsinline
            playsinline
          ></video>
          <div class="video-info" absolute bottom-8 left-4 right-4 text-white>
            <div class="video-title text-lg font-bold mb-2">{{ item?.title }}</div>
            <div class="video-author flex items-center">
              <img :src="item?.author?.avatar" class="author-avatar w-8 h-8 rounded-full mr-2" />
              <span class="author-name">{{ item?.author?.name }}</span>
            </div>
          </div>
        </div>
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
  top: 1rem;
  left: 1rem;
  right: 0;
  height: 44px;
  display: flex;
  align-items: center;
  z-index: 100;

  filter: drop-shadow(var(--el-text-color-primary) 0 0 10px);

  .statusbar & {
    height: 80px;
  }

  .fullscreen & {
    padding-top: 64px;
  }
}

.nav-left {
  color: var(--el-bg-color);
  font-size: 20px;
  cursor: pointer;

  filter: drop-shadow(var(--el-text-color-primary) 0 0 10px);
}

.nav-title {
  color: var(--el-bg-color);
  font-size: 16px;
  font-weight: 500;
}

.video-card {
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
}

.video-info {
  background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0));
  padding: 16px;
  border-radius: 0 0 4px 4px;
}

.video-content {
  object-fit: cover;
}
</style>
