<script setup lang="ts">
import { useRequest } from "alova/client";
import { toast, Toaster } from "vue-sonner";
import Auth from "~/modules/auth/index.vue";
import Core from "~/modules/core/index.vue";
import FloatingBall from "~/modules/ai/bubble/index";
import DeveloperConsole from "~/modules/develop/index.vue";
import Splash from "~/modules/splash/index.vue";
import {
  globalPreference,
  type LeafDictStorage,
  ModeType,
} from "~/modules/words";
import { modeManager } from "~/modules/words/mode";
import { ComprehensiveMode } from "~/modules/words/mode/comprehensive";
import { ReadingMode } from "~/modules/words/mode/reading";
// import { DictWordMode } from '~/modules/words/mode/dict-word'
// import { PunchMode } from '~/modules/words/mode/punch'
import { SoundMode } from "~/modules/words/mode/sound";

import { initApi } from "./composables/api";

import { useLeafEventBus } from "./composables/event";
import { AuthSuccessEvent } from "./composables/event/auth";
import { ToastEvent } from "./composables/event/toast-event";
import { useBaseRouteStore } from "./composables/store/route-store";
import { $logout, globalAuthStorage, initAuthModule } from "./modules/auth";
import ExploreIndex from "./pages/explore/index.vue";
import PersonalIndex from "./pages/personal/index.vue";
import { setToastDefaultOptions } from "vant";
import { useUserStore } from "./composables/store/user-store";
import { UserConfigSaveEvent } from "./composables/event/config";

modeManager.set(
  ModeType.COMPREHENSIVE,
  (dictionaryStorage: LeafDictStorage) =>
    new ComprehensiveMode(dictionaryStorage),
);
// modeManager.set(ModeType.PUNCH, (dictionaryStorage: DictStorage) => new PunchMode(dictionaryStorage))
modeManager.set(
  ModeType.SOUND,
  (dictionaryStorage: LeafDictStorage) => new SoundMode(dictionaryStorage),
);
modeManager.set(
  ModeType.READING,
  (dictionaryStorage: LeafDictStorage) => new ReadingMode(dictionaryStorage),
);
// modeManager.set(ModeType.READING, (dictionaryStorage: DictStorage) => new DictWordMode(dictionaryStorage))

initApi();
initAuthModule();

const eventBus = useLeafEventBus();
const router = useRouter();
// const routes = router.getRoutes();
const baseRouteStore = useBaseRouteStore();

const theme = computed(() => {
  return useDark().value ? "dark" : "light";
});

eventBus.registerListener(ToastEvent, {
  handleEvent(event) {
    const { message, type } = event as ToastEvent;

    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
      case "error":
        toast.error(message);
        break;
    }
  },
});

const { send: refreshUserData } = useRequest(
  () => Apis.userController.getLoginUserUsingGET(),
  {
    immediate: false,
  },
);

const userStore = useUserStore();
const { send: getUserConfig } = useRequest(
  () => Apis.userConfigController.getCurrentUserConfigUsingGET(),
  {
    immediate: false,
  },
);

watch(
  () => globalPreference.value,
  () => {
    userStore.privateConfig.preference = markRaw(globalPreference.value);

    userStore.saveConfig();
  },
  {
    deep: true,
  },
);

const { send: saveUserConfig } = useRequest(
  () =>
    Apis.userConfigController.updateCurrentUserConfigUsingPOST({
      data: {
        privateConfig: userStore.privateConfig,
        publicConfig: userStore.publicConfig,
      },
    }),
  {
    immediate: false,
  },
);

eventBus.registerListener(UserConfigSaveEvent, {
  async handleEvent(event) {
    console.log(`[UserConfigSaveEvent] ${event.executor}`);

    const config = await saveUserConfig();

    console.log(`[UserConfigSaveEvent] ${config.data}`, config);
  },
});

eventBus.registerListener(AuthSuccessEvent, {
  async handleEvent() {
    const res = await refreshUserData();
    if (!res) {
      $logout();
      return;
    }

    const config = await getUserConfig();

    userStore.updateConfig(config.data);

    globalPreference.value = userStore.privateConfig.preference;

    globalAuthStorage.value.user = res.data;
  },
});

router.beforeEach(async (to, from) => {
  const metaTransition = from.meta?.transition;

  if (!metaTransition || metaTransition === "nav") {
    return;
  }

  if (!to.matched?.length) {
    return;
  }

  const filterMatched = to.matched.filter((item: any) => item.components);
  const toComponentName = filterMatched?.[0]?.components?.default.name;

  await sleep(300);

  baseRouteStore.updateExcludeRoutes({
    type: "add",
    value: toComponentName!,
  });

  await sleep(300);

  baseRouteStore.updateExcludeRoutes({
    type: "remove",
    value: toComponentName!,
  });

  return true;
});

setToastDefaultOptions({
  duration: 1200,
  forbidClick: true,
});
</script>

<template>
  <el-config-provider :z-index="10000000">
    <Splash>
      <template #main>
        <router-view v-slot="{ Component }">
          <TransitionPage>
            <!-- ['DictionaryPage', 'SignedPage'] -->
            <!-- 'IndexPage', 'PersonalPage', 'ExplorePage' -->
            <!-- :lru="10" :exclude="['DictionaryPage', 'SignedPage']" -->
            <keep-alive
              :include="['IndexPage', 'PersonalPage', 'ExplorePage']"
              :exclude="baseRouteStore.excludeNames"
            >
              <component :is="Component" />
            </keep-alive>
          </TransitionPage>
        </router-view>

        <Auth />
        <Core />
        <FloatingBall />
        <DeveloperConsole />
        <Toaster :theme="theme" richcolors mt-8 position="top-center" />
        <PreloadPage :components="[PersonalIndex, ExploreIndex]" />
      </template>
    </Splash>
  </el-config-provider>
</template>

<style lang="scss">
.highlight {
  color: var(--theme-color-primary);
}
</style>
