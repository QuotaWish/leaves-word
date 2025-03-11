<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  src: string
  isPlaying: boolean
  isPaused: boolean
}>()

const emit = defineEmits<{
  (e: 'play', index: number): void
  (e: 'timeupdate', currentTime: number, duration: number): void
  (e: 'loaded'): void
  (e: 'ended'): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const isLoading = ref(true)

// 更新视频进度
const updateProgress = (e: Event) => {
  const video = e.target as HTMLVideoElement
  currentTime.value = video.currentTime
  duration.value = video.duration
  emit('timeupdate', currentTime.value, duration.value)
}

// 视频加载完成
const handleVideoLoaded = () => {
  isLoading.value = false
  emit('loaded')
}

// 视频播放控制
const handleVideoPlay = () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0
    videoRef.value.play().catch((error) => {
      console.error('视频播放失败:', error)
    })
  }
}

// 监听视频播放结束
const handleVideoEnded = () => {
  emit('ended')
}

// 监听播放状态变化
watch(() => props.isPlaying, (newVal) => {
  if (videoRef.value) {
    if (newVal) {
      videoRef.value.currentTime = 0
      videoRef.value.play().catch((error) => {
        console.error('视频播放失败:', error)
      })
    } else {
      videoRef.value.pause()
    }
  }
})

// 监听暂停状态变化
watch(() => props.isPaused, (newVal) => {
  if (videoRef.value) {
    if (newVal) {
      videoRef.value.pause()
    } else {
      videoRef.value.play().catch((error) => {
        console.error('视频播放失败:', error)
      })
    }
  }
})

// 清理
onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
    videoRef.value.src = ''
  }
})
</script>

<template>
  <div class="video-player">
    <video ref="videoRef" :src="src" class="video" loop @ended="handleVideoEnded" @play="handleVideoPlay"
      @timeupdate="updateProgress" @loadedmetadata="updateProgress" @loadeddata="handleVideoLoaded"></video>
    <div class="play-overlay" v-if="isPaused">
      <div class="play-icon">
        <i class="el-icon-video-play"></i>
        <span>点击播放</span>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress" :style="{ width: `${(currentTime / duration) * 100}%` }"></div>
      <div class="loading-progress" v-if="isLoading">
        <div class="loading-wave"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-player {
  width: 100%;
  height: 100%;
  position: relative;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  backdrop-filter: blur(2px);
}

.play-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.play-icon i {
  font-size: 48px;
  color: white;
}

.play-icon span {
  color: white;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 12px;
  border-radius: 16px;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 3;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--el-color-primary);
  transition: width 0.1s linear;
}

.loading-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.loading-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: wave 1.5s infinite;
}

@keyframes wave {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style> 