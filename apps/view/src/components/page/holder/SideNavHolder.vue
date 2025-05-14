<script setup lang="ts">
import { ISideNavHolderEmits, ISideNavHolderProps } from "../types";

const props = withDefaults(defineProps<ISideNavHolderProps>(), { adapt: true });

// const emits = defineEmits<ISideNavHolderEmits>();

const ins = ref(getCurrentInstance());

console.log(ins);
</script>

<template>
  <PageNavHolder v-bind="props" :contentPadding="false" class="SideNavHolder">
    <template #topHeader>
      <slot name="topHeader" />
    </template>

    <template #action>
      <slot name="action" />
    </template>

    <template #bg>
      <slot name="bg" />
    </template>

    <template v-if="ins?.slots.header" #header>
      <slot name="header" />
    </template>

    <template #empty>
      <slot name="empty" />
    </template>

    <div relative h-full flex flex-col class="SideNavHolder-Container">
      <div class="SideNavHolder-Content w-full flex flex-1 overflow-scroll">
        <div
          v-if="ins?.slots.nav"
          class="SideNavHolder-Nav z-1 w-[80px] flex-shrink-0"
        >
          <slot name="nav" />
        </div>
        <div
          class="SideNavHolder-Main w-full flex-1 gap-4 overflow-x-hidden overflow-y-scroll p-2"
        >
          <slot />
        </div>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.SideNavHolder-Main {
  background-color: var(--el-fill-color-dark);
}
</style>

<style lang="scss">
.SideNavHolder-Nav {
  li.active {
    &::before {
      transform: scale(1);
    }
    background-color: var(--el-fill-color-dark);
  }

  li {
    &::before {
      content: "";
      position: absolute;

      top: 15%;
      left: 0;

      width: 5px;
      height: 70%;

      transition: 0.25s;
      transform: scale(0);
      border-radius: 0 10px 10px 0;
      background-color: var(--theme-color-primary);
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
}
</style>
