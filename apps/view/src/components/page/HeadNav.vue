<script setup lang="ts">
import { computed, defineEmits, defineProps } from "vue";

interface HeadNavProps {
  title?: string;
  showBack?: boolean;
  showAction?: boolean;
  actionText?: string;
  isTransparent?: boolean;
  isBlur?: boolean;
  expand?: boolean;
}

const props = withDefaults(defineProps<HeadNavProps>(), {
  title: "标题",
  showBack: true,
  showAction: false,
  actionText: "更多",
  isTransparent: false,
  isBlur: false,
  expand: false,
});

const emit = defineEmits<{
  (e: "back"): void;
  (e: "action"): void;
}>();

const truncatedTitle = computed(() => {
  if (props.title.length <= 10) {
    return props.title;
  }
  return `${props.title.slice(0, 3)}...${props.title.slice(-3)}`;
});

function handleBack(): void {
  emit("back");
}

function handleAction(): void {
  emit("action");
}
</script>

<template>
  <div
    class="HeadNav transiction-cubic"
    :class="{
      'head-nav--transparent': isTransparent,
      'head-nav--blur': isBlur,
      'fake-background': isBlur,
      expand,
    }"
  >
    <div class="HeadNav-Inner px-2">
      <div class="head-nav__left">
        <slot name="left">
          <div class="head-nav__back" @click="handleBack">
            <i class="head-nav__back-icon" />
            <span class="head-nav__back-text">返回</span>
          </div>
        </slot>
      </div>
      <div class="head-nav__title">
        <slot name="title">
          {{ truncatedTitle }}
        </slot>
      </div>
      <div class="head-nav__right">
        <slot name="right">
          <div v-if="showAction" class="head-nav__action" @click="handleAction">
            {{ actionText }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.HeadNav.expand {
  margin-top: -44px;

  height: 88px;
}

.HeadNav-Inner {
  position: absolute;

  width: 100%;
  height: 44px;

  left: 0;
  bottom: 0;

  display: flex;
  align-items: center;
}

.HeadNav {
  height: 44px;
  width: 100%;
  background-color: var(--el-fill-color);
  position: relative;
  box-sizing: border-box;
  font-size: 14px;
}

.head-nav--transparent {
  background-color: transparent;
  border-bottom: none;
}

.head-nav--blur {
  background-color: #0000;
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: none;
}

.head-nav__left {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 16px;
  cursor: pointer;
}

.head-nav__back {
  display: flex;
  align-items: center;
  color: var(--el-text-color-primary);
}

.head-nav__back-icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-left: 2px solid var(--el-text-color-primary);
  border-bottom: 2px solid var(--el-text-color-primary);
  transform: rotate(45deg);
  margin-right: 4px;
}

.head-nav__back-text {
  font-size: 14px;
}

.head-nav__title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 16px;
}

.head-nav__right {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
}

.head-nav__action {
  color: #333;
  font-size: 14px;
}
</style>
