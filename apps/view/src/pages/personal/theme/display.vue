<script setup lang="ts">
import PageNavHolder from "~/components/page/holder/PageNavHolder.vue";
import ColorOption from "~/components/settings/ColorOption.vue";
import {
  isDark,
  toggleDark,
  themeColor,
  themeColorMap,
  changeThemeColor,
  useTheme,
  displayModeState,
} from "~/composables/theme";

const autoDarkModes = reactive([
  {
    kety: "manual",
    title: "手动切换模式",
    desc: "手动切换至暗黑模式",
    active: computed(() => displayModeState.value.autoDark === "manual"),
  },
  {
    key: "sync",
    title: "系统随动模式",
    desc: "自动同步系统模式",
    active: computed(() => displayModeState.value.autoDark === "sync"),
  },
  {
    key: "sunshine",
    title: "日月升降模式",
    desc: "日落时自动切换至暗黑模式",
    active: computed(() => displayModeState.value.autoDark === "sunshine"),
  },
]);
</script>

<template>
  <PageNavHolder immersive class="ThemeDisplayPage" title="显示模式设置">
    <!-- 显示模式 -->
    <SettingsSection plain title="自动切换至暗黑模式" icon="i-carbon-time">
      <div class="AutoDarkMode flex flex-col justify-between gap-4">
        <div
          @click="displayModeState.autoDark = autoDarkMode.key as any"
          class="AutoDarkMode-Item"
          :class="{ active: autoDarkMode.active }"
          v-for="(autoDarkMode, index) in autoDarkModes"
          :key="index"
        >
          <p font-bold>{{ autoDarkMode.title }}</p>
          <p text-sm>{{ autoDarkMode.desc }}</p>
        </div>
      </div>
    </SettingsSection>

    <LineArrow my-4>
      <template #icon>
        <div i-carbon-help />
      </template>
      了解暗黑模式
    </LineArrow>

    <br />
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.AutoDarkMode-Item {
  &.active {
    border: 1px solid var(--theme-color-primary);
  }
  &:active {
    background-color: var(--el-fill-color-light);
  }
  padding: 1rem;

  cursor: pointer;
  user-select: none;
  border-radius: 18px;
  background-color: var(--el-fill-color);
}
</style>
