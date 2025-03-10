<script lang="ts">
// @ts-ignore
const envType = process.env.NODE_ENV;

interface LeafEvent {
  event: string;
  data: any;
}

// 根据不同环境设置不同的URL
const getEnvironmentUrl = (): string => {
  let baseUrl = "";
  if (envType === "development") {
    baseUrl = "http://192.168.43.6:3333";
  } else {
    baseUrl = "https://app.leavesword.quotawish.com";
  }

  // 添加query=builder参数
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}query=builder`;
};

let wv: any;
export default {
  name: 'LeafWebView',
  emits: ['ready'],
  data() {
    return {
      url: '',
      timeoutTimer: null as number | null,
      leafDoneReceived: false,
      loadError: false,
      errorText: '',
      height: 0
    }
  },
  methods: {
    loadWebView(): void {
      this.url = getEnvironmentUrl();

      console.log('loadWebView', this.url);

      // create webview
      setTimeout(() => {
        wv = plus.webview.create(this.url, "leaf-webview")

        // @ts-ignore
        const currentWebview = this.$parent.$scope.$getAppWebview()
        currentWebview.append(wv)

        this.handleLoad()
      })

      // 清除之前的定时器（如果有）
      if (this.timeoutTimer !== null) {
        clearTimeout(this.timeoutTimer);
      }

      // 设置3分钟超时检测
      this.timeoutTimer = setTimeout(() => {
        if (!this.leafDoneReceived) {
          this.errorText = "页面加载超时，是否重新加载？";
          this.loadError = true;
        }
      }, 3 * 60 * 1000); // 3分钟
    },

    reloadWebView(): void {
      this.loadError = false;
      this.loadWebView();
    },

    handleError(event: any): void {
      console.error("Webview 加载失败:", event);
      this.loadError = true;

      uni.showToast({
        title: "页面加载失败，请检查网络连接",
        icon: "none",
      });
    },

    // 处理从网页接收的消息
    handleMessage(event: any): void {
      console.log("收到网页消息:", event);
      try {
        const message = event.detail ? event.detail : event;

        // 检查是否收到leaf:done事件
        if (message && message.data === "leaf:done") {
          this.leafDoneReceived = true;
          // 收到leaf:done事件后，清除超时定时器
          if (this.timeoutTimer !== null) {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;

            this.$emit('ready');
          }
        }
      } catch (error) {
        console.error("处理消息时出错:", error);
      }
    },

    postMessage(msg: LeafEvent): void {
      wv.evalJS(`window.$uniMsg(${JSON.stringify(msg)})`);
    },

    handleLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.height = res.windowHeight;
      }
    });

    // @ts-ignore
    const currentWebview = this.$parent.$scope.$getAppWebview()
    setTimeout(() => {
      wv.setStyle({
        height: `${this.height}px`
      });

      // if (plus.os.name !== 'iOS') {
      //   uni.onKeyboardHeightChange((res) => {
      //     if (res.height === 0) {
      //       wv.setStyle({
      //         height: `${this.height}px`
      //       });
      //     } else {
      //       wv.setStyle({
      //         height: 'null'
      //       });
      //     }

      //     console.log("=====", res.height, wv.getStyle());
      //   });
      // }
    }, 1000);
  }
  },

  mounted(): void {
    this.loadWebView();
  },

  beforeDestroy(): void {
    if (this.timeoutTimer !== null) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  },

  // 处理返回按钮事件
  onBackPress(e: any): boolean {
    console.log('onBackPress', e);

    this.postMessage({
      event: 'backpress',
      data: e
    });

    return true;
  },
}
</script>

<template>
  <view></view>
  <!-- <web-view :progress="false" :src="url" @error="handleError" class="web-view" @load="handleViewLoaded" ref="webViewRef"
    :style="{
      popGesture: 'none',
      opacity: isLoading ? 0 : 1,
      visibility: isLoading ? 'hidden' : 'visible',
    }" @message="handleMessage"></web-view> -->
</template>