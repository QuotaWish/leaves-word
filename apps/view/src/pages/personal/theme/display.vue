<script setup lang="ts">
import PageNavHolder from "~/components/page/holder/PageNavHolder.vue";
import { displayModeState } from "~/composables/theme";

const router = useRouter();
const autoDarkModes = reactive<any>([
  {
    key: "manual",
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
    disabled: true,
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
          v-for="(autoDarkMode, index) in autoDarkModes"
          :key="index"
          class="AutoDarkMode-Item"
          :class="{
            active: autoDarkMode.active,
            disabled: autoDarkMode.disabled,
          }"
          @click="displayModeState.autoDark = autoDarkMode.key"
        >
          <p font-bold>
            {{ autoDarkMode.title }}
          </p>
          <p text-sm>
            {{ autoDarkMode.desc }}
          </p>
        </div>
      </div>
    </SettingsSection>

    <LineArrow @click="router.push('/personal/theme/dark-help')" my-4>
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
    border: 2px solid var(--theme-color-primary);
  }
  &:active {
    background-color: var(--el-fill-color-light);
  }
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  padding: 1rem;

  cursor: pointer;
  user-select: none;
  border-radius: 18px;
  background-color: var(--el-fill-color);
  border: 2px solid #0000;
}
</style>
