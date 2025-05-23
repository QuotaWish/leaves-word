<script setup lang="ts">
import PageNavHolder from "~/components/page/holder/PageNavHolder.vue";
import ColorOption from "~/components/settings/ColorOption.vue";
import {
  changeThemeColor,
  displayModeState,
  isDark,
  themeColor,
  themeColorMap,
  toggleDark,
} from "~/composables/theme";

const router = useRouter();

// 主题色相关
const themeColors = Object.entries(themeColorMap).map(([key, value]) => ({
  name: key,
  color: value.primary,
  label:
    {
      blue: "深空蓝",
      green: "自然绿",
      purple: "梦幻紫",
      orange: "活力橙",
      red: "热情红",
    }[key] || "未知颜色",
}));

// 选择主题色
function selectThemeColor(color: string, event: MouseEvent) {
  changeThemeColor(color as any, event);
}
</script>

<template>
  <PageNavHolder immersive class="ThemePage" title="主题设置">
    <!-- 显示模式 -->
    <SettingsSection plain title="显示模式" icon="i-carbon-screen">
      <div class="display-mode my-4">
        <ThemeMode
          mode="light"
          :active="!isDark"
          @click="($event) => toggleDark(false, $event)"
        />
        <ThemeMode
          mode="dark"
          :active="isDark"
          @click="($event) => toggleDark(true, $event)"
        />
      </div>
    </SettingsSection>

    <LineArrow my-4 @click="router.push('/personal/theme/display')">
      <template #icon>
        <div i-carbon-screen />
      </template>
      显示模式设置
      <template #end>
        <template v-if="displayModeState.autoDark === 'manual'">
          手动切换模式
        </template>
        <template v-if="displayModeState.autoDark === 'sync'">
          系统随动模式
        </template>
        <template v-if="displayModeState.autoDark === 'sunshine'">
          日月升降模式
        </template>
      </template>
    </LineArrow>

    <!-- 主题颜色 -->
    <SettingsSection plain title="主题颜色" icon="i-carbon-color-palette">
      <div class="color-options">
        <ColorOption
          v-for="colorItem in themeColors"
          :key="colorItem.name"
          :color="colorItem.color"
          :name="colorItem.name"
          :label="colorItem.label"
          :active="themeColor === colorItem.name"
          @select="($event) => selectThemeColor(colorItem.name, $event)"
        />
      </div>
    </SettingsSection>

    <LineArrow my-4>
      <template #icon>
        <div i-carbon:boolean />
      </template>
      混色配置
    </LineArrow>

    <LineArrow my-4>
      <template #icon>
        <div i-carbon:color-switch />
      </template>
      真实阴影
    </LineArrow>

    <LineArrow my-4>
      <template #icon>
        <div i-carbon:view />
      </template>
      护眼模式
    </LineArrow>

    <br />
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.display-mode {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.color-options {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  padding: 0.5rem;
}

.custom-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
