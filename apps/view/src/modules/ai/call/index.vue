<script setup lang="ts">
import {
  WsChatClient,
  WsChatEventNames,
  WsToolsUtils,
} from '@coze/api/ws-tools';
import { showFailToast } from 'vant';

const router = useRouter()

const client = new WsChatClient({
  token: 'pat_AUX7iLyURxmkEdKnr0m9sRFBg7zUHJUuer5GVnjEcZ6Sa40X80c0JFZWk0tMZ9iY***',
  botId: '7448405006673412115',
  allowPersonalAccessTokenInBrowser: true,
});

client.on(WsChatEventNames.ALL, (eventName, data) => {
  console.log(eventName, data);
});

onMounted(async () => {
  const result = await WsToolsUtils.checkDevicePermission();
  if (!result.audio) {
    showFailToast("需要麦克风访问权限")

    await sleep(1500)

    router.back()

    return
  }

  try {
    await client.connect();
  } catch (error) {
    console.log('连接失败', error);
  }
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>
