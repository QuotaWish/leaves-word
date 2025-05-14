<script setup lang="ts">
import PageNavHolder from "~/components/page/holder/PageNavHolder.vue";
import { useDevMode } from "~/modules/develop";
import { useRouter } from "vue-router";

// 导入开发者模式设置
const { devModeEnabled } = useDevMode();
const router = useRouter();

// 页面跳转函数
function navigateTo(path: string) {
  router.push(path);
}

// 跳转到开发者页面
function navigateToDeveloperPage() {
  navigateTo("/personal/develop");
}

// 跳转到主题设置页面
function navigateToThemePage() {
  navigateTo("/personal/theme");
}

// 默认广告状态
const noAdsEnabled = ref(false);

// 切换广告状态
function toggleNoAds(value: boolean) {
  noAdsEnabled.value = value;
}

// 添加强制更新逻辑
const forceUpdate = inject("forceUpdate");

watch(
  () => isDark.value,
  () => {
    if (typeof forceUpdate === "function") forceUpdate();
  },
);
</script>

<template>
  <PageNavHolder immersive class="SettingsPage" title="个人设置">
    <div
      class="SettingsPage-Container w-full h-full overflow-y-scroll flex flex-col"
    >
      <!-- 主题与皮肤 -->
      <SettingsSection
        title="主题与皮肤"
        icon="i-carbon:paint-brush"
        color="#5E9CFF"
      >
        <SettingsItem
          title="主题设置"
          desc="暗黑模式与主题色选择"
          arrow
          @click="navigateToThemePage"
        />
        <SettingsItem title="皮肤定制" desc="自定义颜色、字体和背景" arrow />
      </SettingsSection>

      <!-- 基础设置 -->
      <SettingsSection
        title="基础设置"
        icon="i-carbon:settings"
        color="#FF9F0A"
      >
        <SettingsItem title="通知设置" desc="管理消息接收方式" arrow />
        <SettingsItem title="隐私设置" desc="数据安全与权限管理" arrow />
      </SettingsSection>

      <!-- 广告与推广 -->
      <SettingsSection title="广告与推广" icon="i-carbon:share" color="#FF3B30">
        <SettingsItem
          title="无广告订阅"
          desc="提升学习体验"
          :show-switch="true"
          :switch-value="noAdsEnabled"
          @switch-change="toggleNoAds"
        />
        <SettingsItem title="活动海报" desc="查看最新平台活动" arrow />
      </SettingsSection>

      <!-- 高级设置 - 添加开发者模式 -->
      <SettingsSection
        v-if="devModeEnabled"
        title="高级设置"
        icon="i-carbon:code"
        color="#AF52DE"
      >
        <SettingsItem
          title="开发者模式"
          desc="启用高级开发工具和调试功能"
          arrow
          @click="navigateToDeveloperPage"
        />
      </SettingsSection>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped></style>
