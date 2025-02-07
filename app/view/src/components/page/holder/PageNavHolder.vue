<script setup lang="ts">
import { NavBar } from 'vant'

withDefaults(defineProps<{
  title: string
  header?: boolean
  loading?: boolean
  contentPadding?: boolean
}>(), {
  contentPadding: true,
})

const router = useRouter()

// 获取插槽
const ins = ref(getCurrentInstance())
</script>

<template>
  <RoutePage :loading="loading" class="PageNavHolder">
    <template #header>
      <NavBar
        :title="title"
        left-text="返回"
        left-arrow
        @click-left="router.back()"
      />
    </template>

    <div relative h-full flex flex-col class="PageNavHolder-Container">
      <div v-if="ins?.slots.header" px-4 py-2 class="DictionaryHolder-Header">
        <slot name="header" />
      </div>

      <div :class="{ 'px-4': contentPadding }" class="PageNavHolder-Content h-full w-full">
        <slot />
      </div>
    </div>
  </RoutePage>
</template>

<style lang="scss" scoped>
.PageNavHolder-Container {
  height: 100%;
}

.PageNavHolder-Content {
  height: 100%;

  overflow-y: auto;
}

.PageNavHolder {
  background-color: var(--el-bg-color);
}

.PageNavHolder-Main {
  background-color: var(--el-fill-color);
}
</style>
