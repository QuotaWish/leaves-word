<template>
  <view class="WordPage">
    <view class="loading-container" :style="{
      opacity: isLoading ? 1 : 0,
      visibility: isLoading ? 'visible' : 'hidden',
      position: isLoading ? 'relative' : 'absolute',
    }">
      <image class="logo" src="/static/logo.svg" />
      <view class="text-area">
        <text class="title">{{ loadingText }}</text>
      </view>
      <view class="loading-spinner"></view>
    </view>

    <template v-if="provider">
		<LeafWebView v-if="provider === 'web'" />
		<LeafTiktokWebView v-if="provider === 'toutiao' || provider === 'tiktok'" />
	</template>
<!-- 
    <view class="error-container" :style="{ display: loadError ? 'flex' : 'none' }">
      <text class="error-text">{{ errorText }}</text>
      <button class="reload-btn" @click="reloadWebView">重新加载</button>
    </view> -->
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import { onBackPress, onShow } from "@dcloudio/uni-app";
import LeafWebView from "@/components/LeafWebView.vue";
import LeafTiktokWebView from '@/components/LeafTiktokWebView.vue'

const height = ref(0)
const url = ref("");
const isLoading = ref(true);
const loadError = ref(false);
const loadingText = ref("加载中...");
const errorText = ref("加载失败，请检查网络连接");
const timeoutTimer = ref<number | null>(null);
const leafDoneReceived = ref(false);
const provider = ref("")

uni.getProvider({
	service: 'oauth',
	success: (res) => {
		provider.value = res.provider?.[0]
	}
})
</script>

<style>
.WordPage {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index: 10;
  transition: opacity 0.3s ease;
}

.web-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  transition: opacity 0.3s ease;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 5rpx solid #f3f3f3;
  border-top: 5rpx solid #3498db;
  border-radius: 50%;
  margin: 40rpx auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  position: absolute;
  bottom: 100rpx;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  margin: 0 40rpx;
  z-index: 20;
}

.error-text {
  font-size: 30rpx;
  color: #ff4d4f;
  margin-bottom: 20rpx;
}

.reload-btn {
  background-color: #1890ff;
  color: white;
  padding: 15rpx 40rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}
</style>
