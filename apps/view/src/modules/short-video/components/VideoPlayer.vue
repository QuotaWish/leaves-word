<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Loading from '~/components/chore/Loading.vue'

// 只接收视频数据作为输入，增加类型定义
const props = defineProps<{
  item: {
    videoUrl?: string
    url?: string
    author?: {
      name?: string
      avatar?: string
    }
    authorAvatar?: string
    description?: string
    id?: string | number
  }
}>()

// 保留必要的事件
const emit = defineEmits<{
  (e: 'play', index: number): void
  (e: 'timeupdate', currentTime: number, duration: number): void
  (e: 'loaded'): void
  (e: 'ended'): void
}>()

// 视频引用
const videoRef = ref<HTMLVideoElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

// 内部状态管理
const isPlaying = ref(false)
const isMuted = ref(false)
const isLiked = ref(false)
const isFollowed = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isLoading = ref(true)
const showControls = ref(false)
const commentCount = ref(Math.floor(Math.random() * 10000))
const shareCount = ref(Math.floor(Math.random() * 5000))
const likeCount = ref(Math.floor(Math.random() * 20000))
const showMutedHint = ref(false)
const autoPlayAttempted = ref(false)
const volumeLevel = ref(1) // 默认音量级别

// 获取视频URL（兼容item.url和item.videoUrl两种情况）
const videoUrl = computed(() => {
  return props.item.url || props.item.videoUrl || ''
})

// 控制计时器，自动隐藏控制栏
let controlsTimer: number | null = null
let mutedHintTimer: number | null = null

// 视频加载完成
const handleVideoLoaded = () => {
  isLoading.value = false
  emit('loaded')

  // 检查视频当前是否静音
  if (videoRef.value) {
    isMuted.value = videoRef.value.muted
  }

  // 尝试自动播放，如果失败则静音播放
  if (!autoPlayAttempted.value) {
    autoPlayAttempted.value = true
    tryAutoPlay()
  }
}

// 尝试自动播放，如果失败则静音播放
const tryAutoPlay = () => {
  if (!videoRef.value) return

  videoRef.value.play().then(() => {
    isPlaying.value = true
    // 确保视频声音正常
    if (videoRef.value) {
      videoRef.value.muted = false
      isMuted.value = false
    }
  }).catch(error => {
    console.warn('自动播放失败，尝试静音播放:', error)
    if (videoRef.value) {
      // 静音并尝试播放
      videoRef.value.muted = true
      isMuted.value = true
      showMutedHint.value = true

      // 显示静音提示，5秒后自动隐藏
      if (mutedHintTimer) {
        clearTimeout(mutedHintTimer)
      }
      mutedHintTimer = window.setTimeout(() => {
        showMutedHint.value = false
      }, 5000)

      videoRef.value.play().catch(err => {
        console.error('静音播放仍然失败:', err)
      })
    }
  })
}

// 更新视频进度
const updateProgress = (e: Event) => {
  const video = e.target as HTMLVideoElement
  currentTime.value = video.currentTime
  duration.value = video.duration
  emit('timeupdate', currentTime.value, duration.value)

  // 更新当前音量值
  if (video && !video.muted) {
    volumeLevel.value = video.volume
  }
}

// 进度百分比计算
const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// 切换播放/暂停
const togglePlay = () => {
  if (!videoRef.value) return

  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play().catch(error => {
      console.error('视频播放失败:', error)

      // 如果播放失败，尝试静音播放
      if (!isMuted.value && videoRef.value) {
        videoRef.value.muted = true
        isMuted.value = true
        showMutedHint.value = true

        // 显示静音提示，5秒后自动隐藏
        if (mutedHintTimer) {
          clearTimeout(mutedHintTimer)
        }
        mutedHintTimer = window.setTimeout(() => {
          showMutedHint.value = false
        }, 5000)

        // 再次尝试播放
        videoRef.value.play().catch(err => {
          console.error('静音播放仍然失败:', err)
        })
      }
    })
  }

  isPlaying.value = !isPlaying.value
  showControls.value = true

  // 重置自动隐藏计时器
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }

  if (isPlaying.value) {
    controlsTimer = window.setTimeout(() => {
      showControls.value = false
    }, 3000)
  }
}

// 点击屏幕显示控制栏
const showControlsTemporarily = () => {
  showControls.value = true

  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }

  if (isPlaying.value) {
    controlsTimer = window.setTimeout(() => {
      showControls.value = false
    }, 3000)
  }
}

// 静音切换
const toggleMute = () => {
  if (!videoRef.value) return

  // 切换静音状态
  videoRef.value.muted = !videoRef.value.muted
  isMuted.value = videoRef.value.muted

  // 如果取消静音，恢复之前的音量
  if (!isMuted.value && videoRef.value) {
    videoRef.value.volume = volumeLevel.value > 0 ? volumeLevel.value : 1
  }

  if (isMuted.value) {
    showMutedHint.value = true
    // 显示静音提示，5秒后自动隐藏
    if (mutedHintTimer) {
      clearTimeout(mutedHintTimer)
    }
    mutedHintTimer = window.setTimeout(() => {
      showMutedHint.value = false
    }, 5000)
  } else {
    showMutedHint.value = false
    if (mutedHintTimer) {
      clearTimeout(mutedHintTimer)
    }
  }
}

// 设置音量
const setVolume = (e: MouseEvent) => {
  if (!videoRef.value) return

  const volumeBar = e.currentTarget as HTMLElement
  const rect = volumeBar.getBoundingClientRect()
  const clickY = e.clientY - rect.top
  const height = rect.height
  let volume = 1 - (clickY / height)

  // 限制音量在0-1之间
  volume = Math.max(0, Math.min(1, volume))
  
  // 设置音量
  videoRef.value.volume = volume
  volumeLevel.value = volume
  
  // 如果音量为0，设置为静音
  if (volume === 0) {
    videoRef.value.muted = true
    isMuted.value = true
  } else if (isMuted.value) {
    // 如果之前是静音状态，取消静音
    videoRef.value.muted = false
    isMuted.value = false
  }
}

// 监听视频播放结束
const handleVideoEnded = () => {
  isPlaying.value = false
  emit('ended')
}

// 更改进度
const setVideoProgress = (e: MouseEvent) => {
  if (!videoRef.value || !duration.value) return

  const progressBar = e.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  const newTime = percent * duration.value

  videoRef.value.currentTime = newTime
  currentTime.value = newTime
}

// 点赞操作
const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    likeCount.value++
  } else {
    likeCount.value--
  }
}

// 关注操作
const toggleFollow = () => {
  isFollowed.value = !isFollowed.value
}

// 格式化数字（超过1万显示为x.x万）
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 格式化时间（将秒转换为分:秒格式）
const formatTime = (time: number) => {
  if (isNaN(time)) return '00:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 实际播放状态变化监听
watch(videoRef, (newVideo) => {
  if (newVideo) {
    newVideo.addEventListener('play', () => {
      isPlaying.value = true
    })

    newVideo.addEventListener('pause', () => {
      isPlaying.value = false
    })
    
    // 监听音量变化
    newVideo.addEventListener('volumechange', () => {
      isMuted.value = newVideo.muted
      if (!newVideo.muted) {
        volumeLevel.value = newVideo.volume
      }
    })
  }
})

// 组件挂载
onMounted(() => {
  // 调整视频容器大小
  if (containerRef.value) {
    // 确保视频容器宽度不超过屏幕宽度
    const maxWidth = Math.min(window.innerWidth, 450) // 手机宽度通常不超过450px
    containerRef.value.style.maxWidth = `${maxWidth}px`
    containerRef.value.style.margin = '0 auto'

    // 监听窗口大小变化，调整容器宽度
    const handleResize = () => {
      if (containerRef.value) {
        const maxWidth = Math.min(window.innerWidth, 450)
        containerRef.value.style.maxWidth = `${maxWidth}px`
      }
    }

    window.addEventListener('resize', handleResize)
  }
})

// 组件卸载
onUnmounted(() => {
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }

  if (mutedHintTimer) {
    clearTimeout(mutedHintTimer)
  }

  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.src = ''
    videoRef.value.load()
  }

  // 移除窗口大小变化监听
  window.removeEventListener('resize', () => { })
})
</script>

<template>
  <div class="tiktok-player" ref="containerRef" @click="showControlsTemporarily">
    <!-- 视频元素 -->
    <video ref="videoRef" :src="videoUrl" class="video" loop preload="auto" playsinline webkit-playsinline
      @click.stop="togglePlay" @ended="handleVideoEnded" @timeupdate="updateProgress" @loadedmetadata="updateProgress"
      @loadeddata="handleVideoLoaded"></video>

    <!-- 加载状态 - 使用Leaf Loading组件 -->
    <div class="loading-overlay" v-if="isLoading">
      <Loading />
    </div>

    <!-- 静音提示 -->
    <div class="muted-hint" v-if="showMutedHint" @click.stop="toggleMute">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="muted-icon">
        <path
          d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>
      <span>视频已静音播放，点击此处取消静音</span>
    </div>

    <!-- 暂停状态中央播放按钮 -->
    <div class="center-play-button" v-if="!isPlaying && !isLoading" @click.stop="togglePlay">
      <div class="play-icon">
        <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 10.554V37.446a1.5 1.5 0 0 0 2.287 1.277l20.596-13.446a1.5 1.5 0 0 0 0-2.554L18.287 9.277A1.5 1.5 0 0 0 16 10.554Z">
          </path>
        </svg>
      </div>
    </div>

    <!-- 右侧互动按钮 -->
    <div class="interaction-buttons">
      <!-- 头像 -->
      <div class="avatar-container">
        <img :src="item.author?.avatar || item.authorAvatar || 'https://via.placeholder.com/50'" class="avatar" />
        <div class="follow-button" :class="{ 'followed': isFollowed }" @click.stop="toggleFollow">
          <span v-if="!isFollowed" class="plus-icon">+</span>
        </div>
      </div>

      <!-- 点赞按钮 -->
      <div class="action-button" @click.stop="toggleLike">
        <div class="icon-container" :class="{ 'active': isLiked }">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <span>{{ formatNumber(likeCount) }}</span>
      </div>

      <!-- 评论按钮 -->
      <div class="action-button">
        <div class="icon-container">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
        <span>{{ formatNumber(commentCount) }}</span>
      </div>

      <!-- 分享按钮 -->
      <div class="action-button">
        <div class="icon-container">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
          </svg>
        </div>
        <span>{{ formatNumber(shareCount) }}</span>
      </div>
    </div>

    <!-- 底部信息栏 -->
    <div class="video-info" :class="{ 'show': showControls || !isPlaying }">
      <div class="author-info">
        <h3>@{{ item.author?.name || '用户名' }}</h3>
        <p>{{ item.description || '视频描述内容...' }}</p>
      </div>

      <!-- 时间显示 -->
      <div class="time-display">
        <span>{{ formatTime(currentTime) }}</span>
        <span class="time-separator">/</span>
        <span>{{ formatTime(duration) }}</span>
      </div>

      <!-- 进度条 -->
      <div class="progress-bar" @click.stop="setVideoProgress">
        <div class="progress-background"></div>
        <div class="progress" :style="{ width: `${progressPercent}%` }"></div>
      </div>

      <!-- 音量控制 -->
      <div class="sound-controls">
        <div class="volume-control" @click.stop="toggleMute">
          <svg v-if="!isMuted" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        </div>
        <div class="volume-slider" @click.stop="setVolume">
          <div class="volume-track"></div>
          <div class="volume-fill" :style="{ height: `${volumeLevel * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tiktok-player {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #000;
  touch-action: manipulation;
  user-select: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  aspect-ratio: 9/16;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.muted-hint {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 4;
  font-size: 13px;
  animation: fadeIn 0.3s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.muted-hint:hover {
  background: rgba(0, 0, 0, 0.9);
}

.muted-icon {
  width: 18px;
  height: 18px;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.center-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}

.play-icon {
  width: 40px;
  height: 40px;
  color: white;
}

.interaction-buttons {
  position: absolute;
  right: 16px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 2;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
}

.follow-button {
  position: absolute;
  bottom: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #FE2C55;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.follow-button.followed {
  background-color: #22D980;
}

.plus-icon {
  line-height: 1;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.icon-container {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-container svg {
  width: 24px;
  height: 24px;
  color: white;
}

.icon-container.active {
  color: #FE2C55;
}

.icon-container.active svg {
  fill: #FE2C55;
}

.action-button span {
  font-size: 12px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.video-info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: white;
  z-index: 1;
  transform: translateY(100px);
  transition: transform 0.3s ease-in-out;
}

.video-info.show {
  transform: translateY(0);
}

.author-info {
  margin-bottom: 16px;
}

.author-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.author-info p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.time-display {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
}

.time-separator {
  margin: 0 4px;
}

.progress-bar {
  position: relative;
  height: 4px;
  width: 100%;
  margin-bottom: 16px;
  cursor: pointer;
}

.progress-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.progress {
  position: absolute;
  height: 100%;
  background-color: #FE2C55;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.sound-controls {
  display: flex;
  align-items: center;
  position: absolute;
  right: 16px;
  bottom: 16px;
  gap: 8px;
}

.volume-control {
  width: 24px;
  height: 24px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.volume-control svg {
  width: 100%;
  height: 100%;
}

.volume-slider {
  height: 80px;
  width: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: none;
  margin-bottom: 20px;
  transform: translateY(-40px);
}

.sound-controls:hover .volume-slider {
  display: block;
}

.volume-track {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
}

.volume-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: white;
  border-radius: 3px;
}
</style>