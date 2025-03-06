<script setup lang="ts">
import { Empty, NavBar } from 'vant'

defineProps<{
  title: string
  empty?: boolean
  loading?: boolean
}>()

const router = useRouter()

const ins = ref(getCurrentInstance())
</script>

<template>
  <RoutePage :loading="loading" class="SideNavHolder">
    <template #header>
      <NavBar
        :title="title"
        left-text="返回"
        left-arrow
        @click-left="router.back()"
      />
    </template>

    <div relative h-full flex flex-col class="SideNavHolder-Container">
      <div v-if="ins?.slots.header" relative px-4 py-2 class="DictionaryHolder-Header">
        <slot name="header" />
      </div>

      <div class="SideNavHolder-Content w-full flex flex-1 overflow-scroll">
        <div v-if="ins?.slots.nav" class="SideNavHolder-Nav z-1 w-[80px] flex-shrink-0">
          <slot name="nav" />
        </div>
        <div class="SideNavHolder-Main w-full flex-1 gap-4 overflow-x-hidden overflow-y-scroll p-2">
          <slot />
        </div>
      </div>

      <div :class="{ visible: empty }" class="transition-cubic SideNavHolder-Empty absolute-layout z-10 flex items-center justify-center">
        <Empty description="你来到了荒漠." />
      </div>
    </div>
  </RoutePage>
</template>

<style lang="scss" scoped>
.SideNavHolder-Empty {
  &.visible {
    opacity: 1;
    pointer-events: auto;
  }

  opacity: 0;
  pointer-events: none;
  background-color: var(--el-fill-color-lighter);
}

.SideNavHolder {
  background-color: var(--el-bg-color);
}

.SideNavHolder-Main {
  background-color: var(--el-fill-color);
}
</style>

<style lang="scss">
.SideNavHolder-Nav {
  li.active {
    &::before {
      transform: scale(1);
    }
    background-color: var(--el-fill-color);
  }

  li {
    &::before {
      content: '';
      position: absolute;

      top: 20%;
      left: 0;

      width: 3px;
      height: 60%;

      transition: 0.25s;
      transform: scale(0);
      background-color: var(--theme-color);
    }
    position: relative;
    padding: 0.25rem 0.25rem;

    height: 50px;

    display: flex;

    font-size: 14px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }

  background-color: var(--el-bg-color);
}
</style>
