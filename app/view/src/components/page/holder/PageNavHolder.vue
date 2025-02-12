<script setup lang="ts">
import { NavBar } from 'vant'

withDefaults(defineProps<{
  title: string
  empty?: boolean
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
  <RoutePage :class="{ empty }" :loading="loading" class="PageNavHolder">
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

        <div class="RoutePage-Empty transition-cubic absolute-layout z-1 h-full w-full flex flex-col items-center justify-center gap-4 p-4">
          <div class="RoutePage-Empty-Illusion">
            <div class="RoutePage-Empty-Illusion-Image">
              <img src="/svg/empty.svg" alt="empty">
            </div>
            <div class="RoutePage-Empty-Illusion-Text">
              <slot name="empty">
                <div>
                  <span>数据踏空而去...</span>
                </div>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RoutePage>
</template>

<style lang="scss" scoped>
.RoutePage-Empty {
  &-Illusion {
    &-Image {
      width: 120px;
      height: 120px;
    }
  }

  .PageNavHolder.empty & {
    transform: scale(1) translateY(0);
  }

  background-color: var(--el-fill-color);

  transform: scale(0.8) translateY(300%);
}

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
