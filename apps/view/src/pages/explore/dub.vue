image.png
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
<<<<<<< HEAD
// import { Star as IconStar } from '@element-plus/icons-vue'  // 修改导入方式
=======
import { Star as IconStar } from '@element-plus/icons-vue'  // 修改导入方式
>>>>>>> c690622aed9868d7e15b1acafefee3230924cc74
import { DUB_VIDEOS } from '~/modules/dub-videos/video-resource'

const router = useRouter()
const isRecording = ref(false)
const currentVideo = ref(DUB_VIDEOS[0])
const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const isLoading = ref(true)
const currentSubtitle = ref('The number of rule in my family?')  // 添加字幕内容

// 处理训练链接点击
const handleTrainingClick = () => {
  router.push('/explore/training')
}

// 视频加载完成
const handleVideoLoaded = () => {
  isLoading.value = false
}

<<<<<<< HEAD
// 添加视频错误处理
const handleVideoError = () => {
  console.error('视频加载失败')
  isLoading.value = false
}

=======
>>>>>>> c690622aed9868d7e15b1acafefee3230924cc74
// 视频播放
const handleVideoPlay = () => {
  isPlaying.value = true
}

// 视频时间更新
const handleVideoTimeUpdate = (currentTime: number, duration: number) => {
  // 这里可以根据时间更新字幕
  // 示例：根据时间更新字幕内容
  if (currentTime < duration / 2) {
    currentSubtitle.value = '第一段字幕内容...'
  } else {
    currentSubtitle.value = '第二段字幕内容...'
  }
}

// 视频结束
const handleVideoEnded = () => {
  isPlaying.value = false
  if (videoRef.value) {
    videoRef.value.currentTime = 0
  }
}

// 切换播放/暂停
const togglePlay = () => {
  if (!videoRef.value) return

  if (isPlaying.value) {
    videoRef.value.pause()
    isPlaying.value = false
  } else {
    videoRef.value.play()
    isPlaying.value = true
  }
}

// 开始录音
const startRecording = () => {
  isRecording.value = true
  // 这里添加录音相关逻辑
}

// 停止录音
const stopRecording = () => {
  isRecording.value = false
  // 这里添加停止录音相关逻辑
}

// 重播
const handleReplay = () => {
  if (!videoRef.value) return
  videoRef.value.currentTime = 0
  videoRef.value.play()
  isPlaying.value = true
}

// 添加难度等级
// 根据视频难度设置星星数量（1-5）
const difficulty = ref(3)  // 示例：3星难度

// 处理难度评分变化
const handleDifficultyChange = (value: number) => {
  difficulty.value = value
}

</script>

<template>
  <PageNavHolder title="趣味配音" class="DubPage">
    <div class="training-link" @click="handleTrainingClick">影视配音训练</div>
    <div class="difficulty-section">
      <div class="difficulty-info">
        <span class="difficulty-label">难度：</span>
        <el-rate v-model="difficulty" :max="5" @change="handleDifficultyChange" />
      </div>
    </div>
    <div class="dub-container">
      <div class="video-section">
<<<<<<< HEAD
        <video
          ref="videoRef"
          class="main-video"
          :src="currentVideo.url"
          @loadeddata="handleVideoLoaded"
          @error="handleVideoError"
=======
        <video ref="videoRef" class="main-video" :src="currentVideo.url" @loadeddata="handleVideoLoaded"
>>>>>>> c690622aed9868d7e15b1acafefee3230924cc74
          @play="handleVideoPlay"
          @timeupdate="(e) => handleVideoTimeUpdate((e.target as HTMLVideoElement).currentTime, (e.target as HTMLVideoElement).duration)"
          @ended="handleVideoEnded">
        </video>
      </div>
      <!-- 添加字幕区域 -->
      <div class="subtitle-section">
        <div class="subtitle-container">
          <div class="subtitle-text english">{{ currentSubtitle }}</div>
          <div class="subtitle-text chinese">我的家规有几条？</div>
        </div>
      </div>
      <div class="control-section">
        <div class="control-buttons">
          <div class="control-button play-button" @click="togglePlay">
            <div class="button-icon" :class="{ 'play-icon': !isPlaying, 'pause-icon': isPlaying }" />
          </div>
          <div class="control-button record-button" :class="{ recording: isRecording }"
            @click="isRecording ? stopRecording() : startRecording()">
            <div class="button-icon record-icon" />
          </div>
          <div class="control-button replay-button" @click="handleReplay">
            <div class="button-icon replay-icon" />
          </div>
        </div>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.dub-container {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--el-bg-color-overlay);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 80h-64V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-96V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64H64C28.7 80 0 108.7 0 144v320c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V144c0-35.3-28.7-64-64-64zM192 448H64V256h128v192zm0-224H64V144h128v80zm128 224H192V256h128v192zm0-224H192V144h128v80zm128 224H320V256h128v192zm0-224H320V144h128v80z" fill="rgba(255,255,255,0.1)"/></svg>');
    background-repeat: repeat;
    background-size: 100px;
    opacity: 0.3;
    animation: floatBackground 60s linear infinite;
    z-index: -1;
  }

  @keyframes floatBackground {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 100% 100%;
    }
  }

  .video-section {
    // 移除 flex: 1，避免视频区域过度拉伸
    display: flex;
    justify-content: center;
    align-items: center; // 修改为 center，使视频垂直居中
    margin: 20px 0; // 调整上下边距，使视频位于中间位置

    .main-video {
      width: 100%;
      max-width: 600px;
      // border-radius: 8px;
      background: #000;
      aspect-ratio: 16/9;
    }
  }

  .control-section {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    margin-top: 20px; // 减小上边距，使按钮上移

    .control-buttons {
      display: flex;
      gap: 32px;
      align-items: center;
    }

    .control-button {
      width: 60px;
      height: 60px;

      &.record-button {
        width: 96px; // 增大一倍
        height: 96px; // 增大一倍

        .button-icon {
          width: 60px; // 图标增大到60px
          height: 60px;
        }
      }

      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-color-primary);
      cursor: pointer;
      transition: all 0.3s ease;

      &.recording {
        background: var(--el-color-danger);
        animation: pulse 1.5s infinite;
      }

      .button-icon {
        width: 32px;
        height: 32px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .play-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>');
      }

      .pause-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>');
      }

      .record-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>');
      }

      .replay-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>');
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.training-section {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  padding: 16px;

  .subtitle-text {
    font-size: 20px;
    color: var(--el-text-color-primary);
    text-align: center;
    max-width: 80%;
    line-height: 1.5;
    background: rgba(0, 0, 0, 0.05);
    padding: 16px;
    border-radius: 8px;
  }
}

.control-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  margin-top: 50px; // 减小上边距，使按钮上移

  .control-buttons {
    display: flex;
    gap: 32px;
    align-items: center;
  }

  .control-button {
    width: 60px;
    height: 60px;

    &.record-button {
      width: 96px; // 增大一倍
      height: 96px; // 增大一倍

      .button-icon {
        width: 60px; // 图标增大到60px
        height: 60px;
      }
    }

    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--el-color-primary);
    cursor: pointer;
    transition: all 0.3s ease;

    &.recording {
      background: var(--el-color-danger);
      animation: pulse 1.5s infinite;
    }

    .button-icon {
      width: 48px;
      height: 48px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .play-icon {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>');
    }

    .pause-icon {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>');
    }

    .record-icon {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>');
    }

    .replay-icon {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>');
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.training-link {
  color: #1677ff;
  font-size: calc(var(--el-font-size-base) + 10px);
  text-align: center;
  margin: 16px 0;
  cursor: pointer;
  font-weight: bold;
}

.subtitle-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  width: 100%;

  .subtitle-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 80%;
    max-width: 800px;

    .subtitle-text {
      width: 100%;
      text-align: center;
      padding: 12px;
      border-radius: 8px;
      // 移除背景样式
      font-size: 20px;
      line-height: 1.5;

      &.english {
        color: var(--el-text-color-primary);
      }

      &.chinese {
        color: var(--el-text-color-regular);
      }
    }
  }
}
</style>

.difficulty-section {
position: relative;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 16px;
margin: 16px 0;
padding: 16px;
background: var(--el-bg-color-overlay);
border-radius: 8px;
box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

.difficulty-info {
display: flex;
align-items: center;
gap: 12px;
width: 100%;
max-width: 400px;

.difficulty-label, .progress-label {
min-width: 70px;
color: var(--el-text-color-regular);
font-size: 16px;
}

.el-rate {
margin-top: 2px;
}

.el-progress {
flex: 1;
}
}
}
