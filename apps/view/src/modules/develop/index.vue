<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import type VConsole from "vconsole";

const devModeEnabled = useStorage("leaves-dev-mode-enabled", false);

// vConsole实例
const vConsoleInstance = ref<VConsole | null>(null);

// 判断是否为开发环境
const isDev = process.env.NODE_ENV === "development";

// 如果是开发环境，动态引入vConsole
async function initVConsole() {
  if (isDev || devModeEnabled.value) {
    try {
      const VConsole = (await import("vconsole")).default;
      if (!vConsoleInstance.value) {
        vConsoleInstance.value = new VConsole();
        console.warn("[Dev] vConsole initialized");
      }
    } catch (err) {
      console.error("[Dev] Failed to load vConsole:", err);
    }
  } else if (vConsoleInstance.value) {
    // 如果不是开发环境或关闭了开发者模式，销毁vConsole实例
    vConsoleInstance.value.destroy();
    vConsoleInstance.value = null;
    console.warn("[Dev] vConsole destroyed");
  }
}

watch(devModeEnabled, initVConsole, { immediate: true });

onUnmounted(() => {
  if (vConsoleInstance.value) {
    vConsoleInstance.value.destroy();
    vConsoleInstance.value = null;
  }
});

onMounted(() => {
  initVConsole();
});
</script>

<template>
  <div hidden />
</template>
