<script>
import { ChatEventType, COZE_CN_BASE_URL, CozeAPI } from '@coze/api';
import {
  EventNames,
  RealtimeAPIError,
  RealtimeClient,
  RealtimeError,
  RealtimeUtils,
} from '@coze/realtime-api';
import { showFailToast } from 'vant';
import RoundButton from '~/components/button/RoundButton.vue';
import RainbowBackground from '~/components/display/RainbowBackground.vue';
import {
  useTokenWithDevice,
  useTokenWithJWT,
  useTokenWithPat,
  useTokenWithPKCE,
  useTokenWithWeb,
} from './hooks/index';
import { NetworkErrorManager } from './network-error-manager';

const botId = '7448405006673412115';
const { getToken } = useTokenWithPat();

export default {
  data() {
    return {
      client: null,
      messageList: [],
      isConnecting: false,
      isConnected: false,
      audioEnabled: true,
      isSupportVideo: false,
      connectStatus: 'disconnected',
      networkManager: null,
    };
  },

  beforeUnmount() {
    this.networkManager?.destroy();
    this.handleDisconnect();
  },

  methods: {
    async getVoices() {
      const api = new CozeAPI({
        token: getToken,
        baseURL: COZE_CN_BASE_URL,
        allowPersonalAccessTokenInBrowser: true,
      });
      const voices = await api.audio.voices.list();
      return voices.voice_list;
    },

    async initClient() {
      if (this.client) {
        return;
      }
      const permission = await RealtimeUtils.checkDevicePermission(true);
      if (!permission.audio) {
        throw new Error('需要麦克风访问权限');
      }
      this.isSupportVideo = permission.video;

      const voices = await this.getVoices();

      this.client = new RealtimeClient({
        accessToken: getToken,
        botId,
        connectorId: '1024',
        voiceId: voices.length > 0 ? voices[0].voice_id : undefined,
        allowPersonalAccessTokenInBrowser: true,
        suppressNonStationaryNoise: true,
        debug: true,
        videoConfig: permission.video
          ? {
              renderDom: 'local-player',
            }
          : undefined,
      });

      this.handleMessageEvent();

      // 这段代码可选，主要处理移动端场景下，网络异常监控处理
      this.networkManager = new NetworkErrorManager(this.client);
      this.networkManager.onStatusChange = (status) => {
        this.connectStatus = status;
        this.isConnecting =
          status === 'connecting' || status === 'reconnecting';
        this.isConnected = status === 'connected';
      };
      // 这段代码可选，主要处理移动端场景下，网络异常监控处理
    },

    handleMessageEvent() {
      let lastEvent;
      this.client?.on(EventNames.ALL_SERVER, (eventName, event) => {
        if (
          event.event_type !== ChatEventType.CONVERSATION_MESSAGE_DELTA &&
          event.event_type !== ChatEventType.CONVERSATION_MESSAGE_COMPLETED
        ) {
          return;
        }
        const content = event.data.content;

        if (
          lastEvent?.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA
        ) {
          this.messageList[this.messageList.length - 1] += content;
        } else if (
          event.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA
        ) {
          this.messageList.push(content);
        }
        lastEvent = event;

        const el = this.$refs.scroll

        el.scrollTop = el.scrollHeight;
      });
    },

    handleConnectClick() {
      this.isConnecting = true;
      this.handleConnect();
    },

    async handleConnect() {
      try {
        if (!this.client) {
          await this.initClient();
        }

        await this.client?.connect();
        this.isConnected = true;
      } catch (error) {
        this.isConnecting = false;
        console.error(error);
        if (error instanceof RealtimeAPIError) {
          switch (error.code) {
            case RealtimeError.CREATE_ROOM_ERROR:
              showFailToast(`创建房间失败: ${error.message}`)
              break;
            case RealtimeError.CONNECTION_ERROR:
              showFailToast(`加入房间失败: ${error.message}`);
              break;
            case RealtimeError.DEVICE_ACCESS_ERROR:
              showFailToast(`获取设备失败: ${error.message}`);
              break;
            default:
              showFailToast(`连接错误: ${error.message}`);
          }
        } else {
          showFailToast(`连接错误：${error}`);
        }
      }
    },

    handleInterrupt() {
      try {
        this.client?.interrupt();
      } catch (error) {
        showFailToast(`打断失败：${error}`);
      }
    },

    handleDisconnect() {
      try {
        this.client?.disconnect();
      } catch (error) {
        showFailToast(`断开失败：${error}`);
      }
    },

    toggleMicrophone() {
      try {
        this.client?.setAudioEnable(!this.audioEnabled);
        this.audioEnabled = !this.audioEnabled;
      } catch (error) {
        showFailToast(`切换麦克风状态失败：${error}`);
      }
    },
  },
};
</script>

<template>
  <div class="AiCall absolute-layout">
    <div class="AiCall-Video absolute-layout z-1">
      <div
        v-if="isSupportVideo"
        id="local-player"
        class="absolute-layout"
      ></div>

      <RainbowBackground :loading="isConnecting" />
    </div>

    <div class="AiCall-Chat absolute bottom-[0%] z-10 w-full bg-[#00000050] px-8 py-4 text-white">
      <div
        ref="scroll"
        style="
            max-height: 50px;
            overflow-y: auto;
          "
      >
        <div v-for="(item, index) in messageList" :key="index" class="AiCall-Chat-Item">
          {{ item }}
        </div>
      </div>
    </div>

    <div class="AiCall-Actions absolute bottom-[12%] z-10 w-full flex items-center justify-center gap-4">
      <RoundButton :disabled="!isConnected" color="#121212F0" class="AiCall-Actions-Button sound">
        <div
          v-if="audioEnabled"
          :disabled="!isConnected"
          @click="toggleMicrophone"
        >
          <div i-carbon:volume-up color-white />
        </div>
        <div v-else @click="toggleMicrophone">
          <div i-carbon:volume-mute color-white />
        </div>
      </RoundButton>
      <RoundButton :disabled="isConnecting" :color="!isConnected ? '#07C160' : '#F54755E0'" class="AiCall-Actions-Button controller">
        <div
          v-if="!isConnected && !isConnecting"
          type="primary"
          @click="handleConnectClick"
        >
          <div i-carbon-phone color-white />
        </div>
        <div v-else-if="isConnecting">
          <Loading class="w-[32px]" />
        </div>
        <div v-else-if="isConnected" danger color-white @click="handleDisconnect">
          <div i-carbon-phone-off />
        </div>
      </RoundButton>
      <RoundButton :disabled="!isConnected" color="#121212F0" class="AiCall-Actions-Button pause" @click="handleInterrupt">
        <div
          :disabled="!isConnected"
          @click="toggleMicrophone"
        >
          <div i-carbon:stop-filled-alt text-white />
        </div>
      </RoundButton>
    </div>
    <!-- <div asbolute right-0 top-0>
      <p>{{ connectStatus }}</p>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
</style>
